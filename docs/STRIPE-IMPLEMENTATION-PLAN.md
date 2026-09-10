# Plan de Implementación — Stripe (Fase B-F)

**Fecha:** 10-Sep-2026
**Estado:** Listo para ejecutar

---

## Decisiones confirmadas

| Decisión | Resolución |
|---|---|
| Precios | Confirmados: developer 49/99/299, broker 39/79/199, private_seller 29/49/99 USD/mes |
| Ciclo | Solo mensual |
| Downgrade con exceso | Permitir, excedentes conviven hasta fin de periodo |
| Cancelación | Revertir a Free al final del periodo, inactivar propiedades excedentes |
| Past_due | Grace period 3 días antes de degradar a Free |
| stripe_customer_id | Columna nueva en `user_profiles` (persiste de por vida) |
| Catálogo de planes | En código (`lib/plans.ts`), sin tabla `plans` en DB |
| Credenciales | El usuario las tiene listas |

---

## Archivos a crear/modificar (12 archivos)

| # | Archivo | Acción | Fase |
|---|---------|--------|------|
| 1 | `.env.example` | Editar — agregar vars Stripe | B |
| 2 | `lib/stripe.ts` | **Crear** — cliente Stripe + helpers | B |
| 3 | `lib/plans.ts` | Editar — agregar `stripePriceId` por tier | B |
| 4 | Migración SQL `026_add_stripe_customer_to_user_profiles.sql` | **Crear** — columna en `user_profiles` | B |
| 5 | `lib/actions.ts` | Editar — `checkout()`, `createPortal()`, reemplazar stub de `changePlan` | B |
| 6 | `app/api/webhooks/stripe/route.ts` | **Crear** — webhook handler | C |
| 7 | `components/auth/payment-page.tsx` | Editar — conectar a `checkout()` | D |
| 8 | `components/platform/billing-page.tsx` | Editar — conectar a `createPortal()`, mostrar fechas | D |
| 9 | `lib/actions.ts` (`saveProperty`) | Editar — enforcement del límite | E |
| 10 | `lib/subscriptions.ts` | Editar — helper `getPlanLimits()` para enforcement | E |
| 11 | `package.json` | Editar — instalar `stripe` SDK | B |
| 12 | `lib/actions.ts` (webhook helper) | Editar — función para inactivar propiedades excedentes | F |

---

## Fase B — Fundamentos (sin frontend visible)

### B1. Variables de entorno

Agregar a `.env.example`:
```
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### B2. Instalar dependencia

```bash
pnpm add stripe
```

### B3. Migración — columna `stripe_customer_id` en `user_profiles`

```sql
-- 026_add_stripe_customer_to_user_profiles.sql
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id
  ON user_profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
```

RLS: no necesita cambios (la columna es del propio usuario, ya protegida por SELECT/UPDATE propio).

### B4. `lib/plans.ts` — agregar `stripePriceId`

Agregar campo `stripePriceId: string | null` a la interfaz `Plan`. El `free` tier tiene `null`. Los 12 tiers de pago obtienen su `price_id` (será configurable por variable de entorno o hardcodeado en el catálogo).

Estructura propuesta:
```typescript
export interface Plan {
  tier: PlanTier;
  name: string;
  price: number;
  currency: string;
  interval: "month";
  maxProperties: number;
  description: string;
  stripePriceId: string | null;  // ← NUEVO
}
```

Los `price_id` se referenciarán como constantes al inicio del archivo (ej: `DEVELOPER_STARTER_PRICE_ID = process.env.DEVELOPER_STARTER_PRICE_ID ?? "price_xxx"`). Esto permite:test con env vars test, prod con env vars prod, sin cambiar código.

### B5. `lib/stripe.ts` — cliente + helpers

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  // 1. Leer user_profiles.stripe_customer_id
  // 2. Si existe, retornarlo
  // 3. Si no, crear customer en Stripe, guardar en user_profiles, retornarlo
}

export async function createCheckoutSession({ customerId, userId, role, tier, plan }: {
  customerId: string;
  userId: string;
  role: string;
  tier: string;
  plan: { stripePriceId: string; price: number };
}): Promise<string> {
  // Crear Checkout Session en mode 'subscription'
  // success_url → /app/billing?upgraded=true
  // cancel_url → /auth/payment
  // metadata: { userId, role, tier }
  // return session.url
}

export async function createPortalSession(customerId: string): Promise<string> {
  // Crear Customer Portal session
  // return_url → /app/billing
  // return portal.url
}

export async function cancelStripeSubscription(subscriptionId: string): Promise<void> {
  // Eliminar suscripción en Stripe (para downgrade inmediato a Free)
}
```

### B6. Server actions en `lib/actions.ts`

**`checkout(role, tier)`** (nueva):
1. `getUser()` — auth check
2. Leer `user_profiles.role`, `email`, `stripe_customer_id`
3. Validar tier vs rol
4. Obtener plan de `getPlan(role, tier)` → verificar `stripePriceId` no es null
5. `getOrCreateStripeCustomer(user.id, email)` → customer ID
6. `createCheckoutSession(...)` → URL
7. Guardar `stripe_customer_id` en `user_profiles` si no existía
8. Retornar `{ url }`

**`createPortal()`** (nueva):
1. `getUser()` — auth check
2. Leer `stripe_customer_id` de `user_profiles`
3. Si no hay customer, error
4. `createPortalSession(customerId)` → URL
5. Retornar `{ url }`

**`changePlan(tier)`** (reemplazar stub):
- Si `tier === "free"` → lógica existente (validar exceso, update subscription)
- Si `tier !== "free"` → llamar a `checkout()` internamente y retornar `{ url }`

**`activateFreePlan()`** — sin cambios significativos

---

## Fase C — Webhook

### C1. `app/api/webhooks/stripe/route.ts`

```typescript
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  const supabase = await createClient(/* service_role */);

  switch (event.type) {
    case "checkout.session.completed":
      // 1. Extraer userId de metadata
      // 2. Leer plan de subscriptions existente
      // 3. Actualizar: plan_name=tier, status=active, stripe_customer_id, stripe_subscription_id, stripe_price_id, periodos
      // 4. Si no existe subscription, crearla
      break;

    case "customer.subscription.updated":
      // 1. Leer subscription por stripe_subscription_id
      // 2. Actualizar status, cancel_at_period_end, periodos
      // 3. Si status cambia a past_due → marcar en DB (pero no degradar aún)
      // 4. Si status cambia a active → limpiar past_due
      break;

    case "customer.subscription.deleted":
      // 1. Leer subscription por stripe_subscription_id
      // 2. Actualizar status → 'cancelled'
      // 3. Crear/actualizar subscription Free
      // 4. Inactivar propiedades que excedan el límite de Free (10)
      break;

    case "invoice.payment_failed":
      // 1. Leer subscription por stripe_subscription_id
      // 2. Marcar status → 'past_due'
      // 3. (El grace period de 3 días se maneja en el frontend/middleware)
      break;
  }

  return new Response("OK", { status: 200 });
}
```

**Nota importante:** El webhook debe usar `createClient()` con `service_role` para poder INSERT/UPDATE en `subscriptions` sin restricciones de RLS (la migración 024 solo permite a `authenticated` escribir `free`).

---

## Fase D — Frontend conectado

### D1. `payment-page.tsx`

Reemplazar el stub de paid tiers:
```typescript
// Antes (stub):
router.push("/app");

// Después (real):
const result = await checkout(selectedTier);
if (result.error) { setError(result.error); return; }
if (result.url) { window.location.href = result.url; }  // Redirect a Stripe
```

Agregar estado de loading con texto "Redirecting to Stripe..."

### D2. `billing-page.tsx`

- Botón "Manage Subscription" → llama `createPortal()` → redirige al Customer Portal de Stripe
- Mostrar `current_period_start` / `current_period_end` formateados
- Si `cancel_at_period_end === true`, mostrar aviso "Your plan will cancel on {date}"
- Botón "Manage Payment Method" → también `createPortal()` (Stripe Portal maneja ambos)
- Si `status === 'past_due'`, mostrar warning amarillo "Payment failed. Please update your payment method."

### D3. Post-pago

- `success_url` → `/app/billing?upgraded=true`
- En `billing-page.tsx`, detectar query param `upgraded` y mostrar toast "Plan upgraded successfully" (usando `sonner`)
- `cancel_url` → `/auth/payment`

---

## Fase E — Enforcement del límite

### E1. Helper en `lib/subscriptions.ts`

```typescript
export async function getPlanLimits(userId: string): Promise<{ maxProperties: number; tier: PlanTier } | null> {
  const subscription = await getActiveSubscription(userId);
  if (!subscription) return null;
  const maxProperties = getMaxProperties(subscription.role, subscription.plan_name);
  return { maxProperties, tier: subscription.plan_name };
}
```

### E2. Enforcement en `saveProperty` (lib/actions.ts)

Antes del INSERT o del toggle `is_active` a `true`:

```typescript
// 1. Si es creación (no payload.id) o si se está activando una propiedad:
const limits = await getPlanLimits(user.id);
if (limits && limits.maxProperties !== -1) {
  const currentCount = await countActiveProperties(user.id);
  const isEditingExisting = Boolean(payload.id);
  const wasActive = isEditingExisting ? await isPropertyActive(user.id, payload.id!) : false;

  if (!wasActive) {  // Solo contar si se está activando una nueva
    if (currentCount >= limits.maxProperties) {
      return { id: null, error: `You've reached the maximum of ${limits.maxProperties} properties on your ${limits.tier} plan. Upgrade at /app/billing.` };
    }
  }
}
```

**Importante:** El enforcement es solo para INSERT y para toggle de inactiva→activa. No bloquea ediciones de propiedades ya activas.

---

## Fase F — Limpieza post-Stripe

### F1. Inactivar propiedades excedentes al cancelar/degradar

Cuando el webhook recibe `customer.subscription.deleted` o cuando el usuario hace downgrade a Free:
1. Contar propiedades activas del usuario
2. Si exceden 10, ordenar por `created_at DESC` y poner `is_active = false` a las más antiguas hasta llegar a 10
3. Retornar count de propiedades inactivadas (para logging)

### F2. Grace period de past_due

- En el webhook, `invoice.payment_failed` marca `past_due`
- En `saveProperty`, si `status === 'past_due'` y `current_period_end` ya pasó + 3 días → tratar como `cancelled` (degradar a Free)
- No se bloquea inmediatamente al primer pago fallido

### F3. Auditoría

- `reviewer`: verificar que el webhook valida firma correctamente
- `security`: verificar que no hay bypass del enforcement (ej: editar property directamente en DB)

---

## Orden de ejecución

```
[B]  Instalar stripe + crear lib/stripe.ts + .env + migración + actions
[C]  Crear webhook handler
[D]  Conectar payment-page + billing-page
[E]  Enforcement en saveProperty
[F]  Limpieza + grace period + inactivar excedentes
```

Cada fase se verifica con `npx tsc --noEmit` y eslint antes de pasar a la siguiente.
