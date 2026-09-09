# Plan: Stripe + Tiered Plans per Profile

**Goal:** Implement Stripe subscriptions where each profile (developer, broker, private_seller) has a Free plan (no Stripe) + 3 paid tiers that limit how many properties they can list. Plans do NOT vary by country.

**Current state (02-Sep-2026):** `/auth/payment` shows a **visual mock** of tiers per profile with property counts based on selection. No Stripe or plan persistence yet. This doc is the step-by-step to implement it for real.

**Date:** 02-Sep-2026

---

## Context

- Currently `lib/pricing-plans.ts` defines a **role × country** matrix (replaced by the mock in `lib/plans.ts`).
- The `subscriptions` table (migration 006) already exists, prepared for Stripe but inactive.
- The auth flow ends at `/app` after `/auth/payment` (currently the page calculates a plan by country and jumps to `/app` without paying).
- **Product decision:** plans are per **profile**, not per country. Each profile: Free + 3 paid tiers. The main limit is the **number of active properties** they can list.
- **Decisions made with the user:**
  - Tier names: developer/broker = `Free / Starter / Pro / Enterprise`; private_seller = `Free / Single / Starter / Pro`.
  - Free plan limits to **10 properties** across all 3 profiles.
  - private_seller focuses on Free + Single first (remaining tiers are reference only).
  - Source of truth for limits = the plan in the DB (not hardcoded in the client), so the limit cannot be bypassed.

---

## Tier model (from the mock `lib/plans.ts`)

| Profile | Free | Single | Starter | Pro | Enterprise |
|---|---|---|---|---|---|
| developer | 10 | — | 50 | 200 | unlimited |
| broker | 10 | — | 25 | 100 | unlimited |
| private_seller | 10 | 1 | 20 | unlimited | — |

Mock prices (USD/month) are reference only: developer (49/99/299), broker (39/79/199), private_seller single (29). Real prices/currency/billing cycle will be confirmed in Stripe before implementation.

---

## Files to create/modify

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | `lib/plans.ts` | Edit | Plan catalog per profile + `getPlan`/`getPlansForRole`/`getMaxProperties` (already created as mock) |
| 2 | `lib/stripe.ts` | **Create** | Stripe client + helpers: `createCheckoutSession`, `createPortalSession`, `cancelSubscription`, `getCustomer` |
| 3 | `lib/subscriptions.ts` | **Create** | Data access: `getActivePlan(userId)`, `getActiveLimits(userId)` |
| 4 | `lib/actions.ts` | Edit | Server actions: `checkout(role, tier, interval)`, `createPortal`, `activateFreePlan` |
| 5 | `app/api/webhooks/stripe/route.ts` | **Create** | Webhook that syncs Stripe subscriptions → Supabase |
| 6 | `components/auth/payment-page.tsx` | Edit | Connect "Select Plan" to `checkout()`; "Free" → `activateFreePlan()` |
| 7 | `app/app/billing/page.tsx` | **Create** | View current plan, switch plans, cancel (Customer Portal) |
| 8 | `app/app/settings/page.tsx` | Edit | Add Billing link + subscription status |
| 9 | `lib/actions.ts` (`saveProperty`) | Edit | Enforcement: reject creation/activation if exceeding `maxProperties` |
| 10 | SQL migration `023_plans_and_subscriptions.sql` | **Create** | `plans` table + seed 4 tiers per profile + `subscriptions` adjustments |
| 11 | `supabase/seed/plans.sql` | **Create** | Upserts for the plan catalog |
| 12 | `.env.example` | Edit | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |

---

## Detailed step-by-step

### Step 1: Stripe dashboard configuration

1. Create an account and project at [stripe.com](https://stripe.com).
2. For each paid tier (12 prices total: 3 profiles × 3 paid tiers), create a **Price**:
   - Product per profile (Developer Plans, Broker Plans, Private Seller Plans).
   - Recurring monthly (or yearly if decided) price in USD.
   - Note the `price_id` for each (format `price_xxx`).
3. Enable the **Customer Portal** (for upgrade/downgrade/cancel from the app).
4. Configure **webhooks**:
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
   - Endpoint: `https://{domain}/api/webhooks/stripe`.
   - Copy the webhook **signing secret**.
5. Define real prices, currency (USD), and billing cycle. Update `lib/plans.ts` and the seed SQL with those values.

### Step 2: Environment variables

Add to `.env.example` (and `.env.local` when implementing):

```
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Step 3: Data migration + seed

Create `supabase/migrations/023_plans_and_subscriptions.sql`:

1. **`plans` table** (catalog):
   - `id`, `role` (CHECK IN developer/broker/private_seller), `tier` (CHECK IN free/single/starter/pro/enterprise), `name`, `price_cents`, `interval` ('month'|'year'), `max_properties` (integer, -1 = unlimited), `stripe_price_id`, `features` (jsonb), `is_active` (bool), timestamps.
   - `UNIQUE (role, tier)`.
   - RLS: SELECT public (catalog by role); writes service_role only.
2. **Adjust `subscriptions`** (migration 006): replace `plan_name`/`country` with `plan_id` (FK → plans) and `tier`. Keep `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `status`, `current_period_start/end`, `cancel_at_period_end`.
3. **Seed** in `supabase/seed/plans.sql`: the 4 tiers per profile with their limits and `price_id`.

### Step 4: `lib/stripe.ts`

- Initialize Stripe with `STRIPE_SECRET_KEY`.
- `createCheckoutSession({ customerId?, userId, role, tier, plan })`: create Checkout Session mode 'subscription', tier price, `success_url` → `/app/billing`, `cancel_url` → the plans page.
- `createPortalSession(customerId)`: redirect to Customer Portal (manage switch/cancel).
- `cancelSubscription(subscriptionId)`.

### Step 5: Server actions in `lib/actions.ts`

- `checkout(role, tier, interval)`: get authenticated user, find/create `stripe_customer_id` (saved in `user_profiles`), call `createCheckoutSession` and return the checkout URL.
- `activateFreePlan()`: no Stripe; upsert in `subscriptions` with the role's Free plan and status 'active'.
- `createPortal()`: call `createPortalSession(customerId)` and return the URL.

### Step 6: Webhook

Create `app/api/webhooks/stripe/route.ts`:

1. Verify signature with `STRIPE_WEBHOOK_SECRET`.
2. On `checkout.session.completed` with `subscription` present → create/update `subscriptions` (user_id, plan_id, status 'active', periods, Stripe IDs).
3. On `customer.subscription.updated` / `deleted` → sync status (`active`, `past_due`, `cancelled`, `trialing`, `incomplete`) and `cancel_at_period_end`.
4. On `invoice.payment_failed` → mark `past_due`.
5. Always respond `200`; `400` if signature fails.

### Step 7: Limit enforcement

In `lib/actions.ts` → `saveProperty` (before INSERT or before activating a property):

1. Read `getActiveLimits(user.id)` → `max_properties` of the active plan.
2. Count user's properties with `is_active = true` (excluding the one being edited).
3. If `max_properties !== -1` and count has reached/maxed out → return error with CTA to Billing (reject).
4. (Optional future) Gate features by tier based on `plans.features`.

> Security note: the limit is validated in the server action (server-side), not just in the client.

### Step 8: Frontend

1. `components/auth/payment-page.tsx`:
   - Paid tier button → call `checkout(role, tier)` and redirect to Stripe URL.
   - Free tier button → call `activateFreePlan()` and navigate to `/app`.
   - Show available count based on selected tier (already implemented in mock).
2. `app/app/billing/page.tsx` (server):
   - Show current plan, subscription status, properties used/available limit.
   - Buttons: Switch plan (upgrade/downgrade) → `createPortal()`; Cancel → `createPortal()`.
3. `app/app/settings/page.tsx`: add Billing section with link to `/app/billing`.
4. Optional: "X of Y properties" banner on `/app/properties` with upgrade CTA.

### Step 9: Testing

- Full flow: signup → confirm → onboarding → plan selection → checkout (Stripe test mode) → webhook → `/app/billing` shows active plan.
- `saveProperty` rejects when `max_properties` is exceeded.
- Cancellation/expiry: `customer.subscription.updated`/`deleted` reflects state in Supabase.
- Free: without going through Stripe, `activateFreePlan` creates the Free subscription (10 properties).

---

## Resulting flow (after implementation)

```
sign-up → confirm-email → confirm → onboarding/{role} → /auth/payment
   ├─ Free tier   → activateFreePlan() → /app   (no Stripe)
   └─ Paid tier   → checkout() → Stripe Checkout Session → successful payment
                     → webhook updates subscriptions → /app/billing
Publish property → saveProperty validates limit based on active plan → blocks if exceeded
```

## Bridging with the current mock

`lib/plans.ts` already exposes `getPlan`, `getPlansForRole`, `getMaxProperties` and `PLANS` (4 tiers per profile). The SQL migration must **seed the same values** (names and `max_properties`) so the DB catalog matches what the frontend displays. The only pending divergence is private_seller (Single/Starter/Pro are shown but the focus is Free + Single).
