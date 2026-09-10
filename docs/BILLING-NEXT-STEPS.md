# Billing — Estado, brechas y checklist para completar Stripe

**Objetivo:** dejar documentado qué tenemos funcionando hoy en el flujo de planes/suscripciones, qué falta para cobrar con Stripe y qué datos/decisiones necesito de vos para avanzar.

**Fecha:** 09-Sep-2026

---

## 1. Estado actual (implementado y verificado)

| Pieza | Estado |
|---|---|
| Plan Free por defecto | Migración `025_default_free_subscription.sql`: todo usuario nuevo recibe `free` al registrarse (trigger `handle_new_user`); backfill idempotente para usuarios existentes sin suscripción activa. Ya corre en tu Supabase (lo verificaste: el usuario ve plan free). |
| RLS de `subscriptions` para fase mock | Migración `024_subscriptions_rls_mock_free.sql`: `authenticated` puede INSERT/UPDATE **solo su propia** suscripción y **solo** a `plan_name = 'free'`; los tiers de pago quedan reservados a `service_role`. Además índice único parcial `(user_id) WHERE status = 'active'`. Ya corre. |
| Server actions | `activateFreePlan()` (crea free), `changePlan(tier)` (valida tier vs rol, rechaza downgrade si excede el límite de propiedades, free sin suscripción delega en `activateFreePlan`, tiers de pago → redirigen a `/auth/payment`). En `lib/actions.ts`. |
| Página de Billing | `/app/billing` (`components/platform/billing-page.tsx`): plan actual, barra de uso de propiedades (`propertyCount` vs `maxProperties`), card Payment Method placeholder ("Stripe coming soon"), grid de planes disponibles con botón Upgrade. Ítem "Billing" en sidebar de los 3 roles. |
| Página de selección de plan | `/auth/payment` (`components/auth/payment-page.tsx`): Free → `activateFreePlan()`; tiers de pago → stub (navega a `/app`). |
| `countActiveProperties` | `lib/subscriptions.ts`: cuenta propiedades con `is_active = true` del usuario. |
| Typecheck + lint | `npx tsc --noEmit` y eslint pasan. |

**Brecha clave:** hoy **no hay manera real de adquirir un plan de pago**: `changePlan` para tiers de pago solo responde una URL de redirect y `payment-page` navega a `/app` sin persistir nada. El `saveProperty` **no impone el límite** del plan.

---

## 2. Lo que falta (checklist técnico)

### Fase A — Datos y credenciales (bloqueado hasta que los tengas)
Ver sección 4. Sin esto no se puede escribir el webhook ni llamar a la API de Stripe.

### Fase B — Fundamentos
- [ ] `lib/stripe.ts`: inicializar cliente con `STRIPE_SECRET_KEY` + helpers (`createCheckoutSession`, `createPortalSession`, `getCustomer`).
- [ ] Server actions en `lib/actions.ts`: `checkout(role, tier)` → crea Checkout Session y devuelve URL; `createPortal()` → Customer Portal; guardar `stripe_customer_id` (la columna ya existe en `subscriptions`).
- [ ] `.env.example` + `.env.local`: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` (+ `NEXT_PUBLIC_APP_URL` para success/cancel URLs).

### Fase C — Webhook de sincronización
- [ ] `app/api/webhooks/stripe/route.ts`: verificación de firma con `STRIPE_WEBHOOK_SECRET`.
- [ ] Eventos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` → sincronizan fila en `subscriptions` (status, `plan_name`, periodos, `cancel_at_period_end`, ids de Stripe).
- [ ] Mapeo `stripe_price_id` → tier/perfil (vía `lib/plans.ts` o tabla `plans`, según decisión 6 de la sección 3).
- [ ] El webhook escribe con `service_role` (las políticas de la migración 024 no lo afectan).

### Fase D — Frontend conectado
- [ ] `payment-page.tsx`: tier de pago → `checkout()` → redirige a la URL de Stripe; estado de "checkout en curso".
- [ ] `billing-page.tsx`: botón "Manage subscription" → `createPortal()` (upgrade/downgrade/cancel); mostrar periodo de facturación y estado real del plan; ocultar/señalar payment method cuando haya card real de Stripe.
- [ ] Página de resultado post-pago (`success_url` → `/app/billing` con toast/estado; `cancel_url` → `/auth/payment`).

### Fase E — Enforcement del límite
- [ ] `saveProperty` (INSERT y al activar una propiedad de inactiva→activa): leer plan activo, contar `is_active = true` con `countActiveProperties` (excluyendo la propiedad que se edita), rechazar si `maxProperties !== -1` y se alcanzó el límite. Error con CTA a Billing.
- [ ] (Recomendado) Aviso de límite en `/app/properties` ("X de Y propiedades"), no solo bloqueo.

### Fase F — Limpieza post-Stripe
- [ ] Revisar qué pasa con las políticas de la 024 (probablemente se mantienen: el INSERT de free queda para el trigger/`activateFreePlan`; los pagados solo via webhook).
- [ ] Tests en modo test: signup → free default → upgrade → checkout → webhook → billing muestra plan pago → bajar de 10 a 1 propiedad activa si corresponde.

### Opcional / diferido
- [ ] Tabla `plans` en DB como fuente de verdad del catálogo (migración nueva, renumerada tras 023 → sería la 026) en vez de `lib/plans.ts` hardcodeado.
- [ ] i18n para `/app/billing` (hoy hardcodeado en inglés; misma convención que el resto del dashboard).

---

## 3. Decisiones de producto que necesito de vos

1. **Precios finales** — el mock usa USD/mes: developer 49/99/299; broker 39/79/199; private_seller Single 29, Starter 49, Pro 99. ¿Confirmás o ajustamos? ¿Un solo ciclo mensual o también por año?
2. **Downgrade con exceso de propiedades** — un usuario en Pro (200) que baja a Starter (50) teniendo 80 activas: ¿bloqueamos el downgrade?, ¿lo permitimos y las 30 que exceden quedan forzadas a inactivas?, ¿lo permitimos y conviven hasta fin de periodo?
3. **Cancelación** — ¿al cancelar vuelve automáticamente a Free al terminar el periodo? ¿Qué pasa con las propiedades que superan el límite de Free (10)?
4. **Pago fallido / vencimiento** — ¿bloqueo inmediato al pasar a `past_due` o grace period (ej: 3 días) antes de degradar?
5. **Dónde guardar `stripe_customer_id`** — la columna ya existe en `subscriptions`. ¿Usamos esa o preferís una columna en `user_profiles` (para consultar el customer incluso sin suscripción activa)? Recomiendo `user_profiles` para persistir el customer de por vida.
6. **Catálogo de planes en DB vs config en código** — hoy `lib/plans.ts` es la fuente (precios, límites). Opción A: seguimos en código y el webhook mapea `price_id` con una tabla/const de equivalencias. Opción B: migración que crea tabla `plans` con seed (4 tiers × perfil con `price_id`). Recomiendo A para el MVP (menos piezas), B cuando quieras cambiar precios sin deploy.

---

## 4. Checklist de datos que necesito de vos (para arrancar la Fase B en adelante)

### Cuenta Stripe (modo test)
- [ ] Cuenta en Stripe (puede ser la tuya en test mode).

### Variables de entorno
- [ ] `STRIPE_SECRET_KEY` (test, formato `sk_test_...`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test, `pk_test_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` (de la CLI `stripe listen` o dashboard, `whsec_...`)

### Productos y precios
- [ ] Crear en el dashboard los **12 precios** (o autorizarme a crearlos por API con la secret key test):
  - Developer: starter 49, pro 99, enterprise 299 (USD/mes)
  - Broker: starter 39, pro 79, enterprise 199 (USD/mes)
  - Private seller: single 29, starter 49, pro 99 (USD/mes)
- [ ] Copiar los 12 `price_id` (formato `price_...`) y pasármelos (o la decisión de generar precios desde código).

### Webhook + Customer Portal
- [ ] Endpoint webhook configurado (producción: `https://{dominio}/api/webhooks/stripe`; local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
- [ ] Eventos habilitados: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
- [ ] Customer Portal habilitado en el dashboard con las opciones que quieras (cambiar plan, cancelar, gestionar método de pago).

### Respuestas de la sección 3
- [ ] Items 1–6 resueltos (al menos 1–5 para arrancar; el 6 me lo podés dar a mitad de camino).

---

## 5. Orden sugerido de trabajo (una vez tenga los datos)

```
[0] Vos:    datos de la sección 4 + respuestas de la sección 3
[1] Yo:     Fase B (lib/stripe.ts + actions + env) + crear precios si me autorizás
[2] Yo:     Fase C (webhook) — probablemente necesites correr `stripe listen` en local
[3] Yo:     Fase D (frontend conectado: payment + billing + resultado)
[4] Yo:     Fase E (enforcement en saveProperty)
[5] Ambos:  QA en modo test (cards de prueba de Stripe: 4242...)
[6] Limpieza: pasar a modo live solo cuando estés conforme (nuevos keys live + webhook live)
```

Nota: las migraciones 024 y 025 ya están aplicadas en Supabase; nada de esto requiere migraciones nuevas salvo que elijas la opción B de la sección 3 (tabla `plans`) o `user_profiles.stripe_customer_id`.