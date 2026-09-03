# Plan: Stripe + Planes por perfil (tiers)

**Objetivo:** Implementar suscripciones con Stripe donde cada perfil (developer, broker, private_seller) tiene un plan Free (sin Stripe) + 3 tiers de pago que limitan cuántas propiedades pueden publicar. Los planes NO varían por país.

**Estado actual (02-Sep-2026):** En `/auth/payment` se muestra un **mock visual** de los tiers por perfil con la cantidad de propiedades según lo seleccionado. No hay Stripe ni persistencia de plan todavía. Este doc es el paso a paso para implementarlo de verdad.

**Fecha:** 02-Sep-2026

---

## Contexto

- Hoy `lib/pricing-plans.ts` define una matriz por **role × país** (reemplazada por el mock de `lib/plans.ts`).
- La tabla `subscriptions` (migración 006) ya existe, preparada para Stripe pero inactiva.
- El flujo de auth termina en `/app` tras `/auth/payment` (hoy la página calcula un plan por país y salta a `/app` sin pagar).
- **Decisión de producto:** los planes son por **perfil**, no por país. Cada perfil: Free + 3 tiers de pago. El límite principal es la **cantidad de propiedades activas** que puede publicar.
- **Decisiones tomadas con el usuario:**
  - Nombres de tiers: developer/broker = `Free / Starter / Pro / Enterprise`; private_seller = `Free / Single / Starter / Pro`.
  - El plan Free limita a **10 propiedades** para los 3 perfiles.
  - private_seller solo tiene Free + Single como prioridad (los demás tiers quedan como referencia).
  - Fuente de verdad del límite = el plan en la DB (no hardcode en cliente), para que el límite no se eluda.

---

## Modelo de tiers (desde el mock `lib/plans.ts`)

| Perfil | Free | Single | Starter | Pro | Enterprise |
|---|---|---|---|---|---|
| developer | 10 | — | 50 | 200 | ilimitado |
| broker | 10 | — | 25 | 100 | ilimitado |
| private_seller | 10 | 1 | 20 | ilimitado | — |

Los precios (USD/mes) del mock son referenciales: developer (49/99/299), broker (39/79/199), private_seller single (29). Se confirmarán precios/moneda/ciclo reales en Stripe antes de implementar.

---

## Archivos a crear/modificar

| # | Archivo | Acción | Descripción |
|---|---------|--------|-------------|
| 1 | `lib/plans.ts` | Editar | Catálogo de planes por perfil + `getPlan`/`getPlansForRole`/`getMaxProperties` (ya creado como mock) |
| 2 | `lib/stripe.ts` | **Crear** | Cliente Stripe + helpers: `createCheckoutSession`, `createPortalSession`, `cancelSubscription`, `getCustomer` |
| 3 | `lib/subscriptions.ts` | **Crear** | Data access: `getActivePlan(userId)`, `getActiveLimits(userId)` |
| 4 | `lib/actions.ts` | Editar | Server actions: `checkout(role, tier, interval)`, `createPortal`, `activateFreePlan` |
| 5 | `app/api/webhooks/stripe/route.ts` | **Crear** | Webhook que sincroniza suscripciones de Stripe → Supabase |
| 6 | `components/auth/payment-page.tsx` | Editar | Conectar "Select Plan" a `checkout()`; "Free" → `activateFreePlan()` |
| 7 | `app/app/billing/page.tsx` | **Crear** | Ver plan actual, cambiar de plan, cancelar (Customer Portal) |
| 8 | `app/app/settings/page.tsx` | Editar | Enlace a Billing + estado de suscripción |
| 9 | `lib/actions.ts` (`saveProperty`) | Editar | Enforcement: rechazar creación/activación si excede `maxProperties` |
| 10 | Migración SQL `023_plans_and_subscriptions.sql` | **Crear** | Tabla `plans` + seed 4 tiers por perfil + ajustes a `subscriptions` |
| 11 | `supabase/seed/plans.sql` | **Crear** | Upserts del catálogo de planes |
| 12 | `.env.example` | Editar | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |

---

## Paso a paso detallado

### Paso 1: Configuración en el dashboard de Stripe

1. Crear cuenta y proyecto en [stripe.com](https://stripe.com).
2. Para cada tier de pago (12 precios en total: 3 perfiles × 3 tiers de pago), crear un **Price**:
   - Producto por perfil (Developer Plans, Broker Plans, Private Seller Plans).
   - Price recurrente mensual (o anual si se decide) en USD.
   - Anotar el `price_id` de cada uno (formato `price_xxx`).
3. Habilitar el **Customer Portal** (para upgrade/downgrade/cancel desde el app).
4. Configurar los **webhooks**:
   - Eventos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
   - Endpoint: `https://{dominio}/api/webhooks/stripe`.
   - Copiar el **signing secret** del webhook.
5. Definir precios, moneda (USD) y ciclo reales. Actualizar `lib/plans.ts` y el seed SQL con esos valores.

### Paso 2: Variable de entorno

Agregar a `.env.example` (y `.env.local` al implementar):

```
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Paso 3: Migración de datos + seed

Crear `supabase/migrations/023_plans_and_subscriptions.sql`:

1. **Tabla `plans`** (catálogo):
   - `id`, `role` (CHECK IN developer/broker/private_seller), `tier` (CHECK IN free/single/starter/pro/enterprise), `name`, `price_cents`, `interval` ('month'|'year'), `max_properties` (integer, -1 = ilimitado), `stripe_price_id`, `features` (jsonb), `is_active` (bool), timestamps.
   - `UNIQUE (role, tier)`.
   - RLS: SELECT público (catálogo por rol); escritura solo service_role.
2. **Ajustar `subscriptions`** (migración 006): reemplazar `plan_name`/`country` por `plan_id` (FK → plans) y `tier`. Mantener `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `status`, `current_period_start/end`, `cancel_at_period_end`.
3. **Seed** en `supabase/seed/plans.sql`: los 4 tiers por perfil con sus límites y `price_id`.

### Paso 4: `lib/stripe.ts`

- Inicializar Stripe con `STRIPE_SECRET_KEY`.
- `createCheckoutSession({ customerId?, userId, role, tier, plan })`: crea Checkout Session mode 'subscription', precio del tier, `success_url` → `/app/billing`, `cancel_url` → la página de planes.
- `createPortalSession(customerId)`: redirige al Customer Portal (administrar cambio/cancelación).
- `cancelSubscription(subscriptionId)`.

### Paso 5: Server actions en `lib/actions.ts`

- `checkout(role, tier, interval)`: obtiene el usuario autenticado, busca/crea el `stripe_customer_id` (guardado en `user_profiles`), llama a `createCheckoutSession` y devuelve la URL de checkout.
- `activateFreePlan()`: sin Stripe; hace upsert en `subscriptions` con el plan Free del rol y status 'active'.
- `createPortal()`: llama a `createPortalSession(customerId)` y devuelve la URL.

### Paso 6: Webhook

Crear `app/api/webhooks/stripe/route.ts`:

1. Verificar firma con `STRIPE_WEBHOOK_SECRET`.
2. En `checkout.session.completed` con `subscription` presente → crear/actualizar `subscriptions` (user_id, plan_id, status 'active', periodos, ids de Stripe).
3. En `customer.subscription.updated` / `deleted` → sincronizar status (`active`, `past_due`, `cancelled`, `trialing`, `incomplete`) y `cancel_at_period_end`.
4. En `invoice.payment_failed` → marcar `past_due`.
5. Respuesta `200` siempre; `400` si la firma falla.

### Paso 7: Enforcement del límite

En `lib/actions.ts` → `saveProperty` (antes de INSERT o de activar una propiedad):

1. Leer `getActiveLimits(user.id)` → `max_properties` del plan activo.
2. Contar propiedades del usuario con `is_active = true` (excluyendo la que se edita).
3. Si `max_properties !== -1` y el count ya alcanzó/maximo → retornar error con CTA a Billing (rechazar).
4. (Opcional futuro) Gatear features por tier según `plans.features`.

> Nota de seguridad: el límite se valida en el server action (server-side), no solo en el cliente.

### Paso 8: Frontend

1. `components/auth/payment-page.tsx`:
   - Botón de un tier de pago → llama `checkout(role, tier)` y redirige a la URL de Stripe.
   - Botón del tier Free → llama `activateFreePlan()` y navega a `/app`.
   - Mostrar la cantidad disponible según el tier seleccionado (ya implementado en el mock).
2. `app/app/billing/page.tsx` (server):
   - Muestra plan actual, estado de suscripción, límite de propiedades usado/disponible.
   - Botones: Cambiar plan (upgrade/downgrade) → `createPortal()`; Cancelar → `createPortal()`.
3. `app/app/settings/page.tsx`: agregar sección Billing con enlace a `/app/billing`.
4. Opcional: banner "X de Y propiedades" en `/app/properties` con CTA upgrade.

### Paso 9: Testing

- Flujo completo: signup → confirm → onboarding → selección de plan → checkout (test mode de Stripe) → webhook → `/app/billing` muestra el plan activo.
- `saveProperty` rechaza cuando se supera `max_properties`.
- Cancelación/vencimiento: `customer.subscription.updated`/`deleted` reflejar state en Supabase.
- Free: sin pasar por Stripe, `activateFreePlan` crea la suscripción Free (10 propiedades).

---

## Flujo resultante (tras implementación)

```
sign-up → confirm-email → confirm → onboarding/{role} → /auth/payment
   ├─ tier Free   → activateFreePlan() → /app   (sin Stripe)
   └─ tier pago   → checkout() → Checkout Session de Stripe → pago exitoso
                     → webhook actualiza subscriptions → /app/billing
Publicar propiedad → saveProperty valida límite según plan activo → bloquea si excede
```

## Empalme con el mock actual

`lib/plans.ts` ya expone `getPlan`, `getPlansForRole`, `getMaxProperties` y `PLANS` (4 tiers por perfil). La migración SQL debe **sembrar los mismos valores** (nombres y `max_properties`) para que el catálogo de la DB coincida con lo que el frontend muestra. La única divergencia pendiente es la de private_seller (se muestran Single/Starter/Pro pero el foco es Free + Single).
