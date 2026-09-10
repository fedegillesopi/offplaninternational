# Stripe Setup — Step-by-step (GO-LIVE)

Everything to configure in the Stripe dashboard and `.env` to finish billing.

> **Status:** the code is complete and verified (tsc, eslint, build pass). Only external Stripe/Supabase configuration and populating `.env` remain.

---

## 0. Env vars to complete in `.env`

| Variable | Where | Example |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | `sk_live_...` (you already have it) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys | `pk_live_...` (you already have it) |
| `STRIPE_WEBHOOK_SECRET` | Generated when you create the webhook (step 3) | `whsec_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (`service_role` key, NOT anon) | `sb_secret_...` |
| `NEXT_PUBLIC_APP_URL` | Your domain | `https://www.offplaninternational.com` |
| 9 × `${ROLE}_${TIER}_PRICE_ID` | Generated when you create prices (step 2) | `price_1...` |

---

## 1. Confirm the live account is operational

The site runs in **LIVE** mode, so Stripe must be able to charge real cards.

1. Dashboard → **Settings → Business details** (`https://dashboard.stripe.com/settings`).
2. Verify: business name, VAT/tax ID, support email/phone, and **bank account** (Payout settings) are complete.
3. Make sure the account isn't in review/restricted status. If verification is required, complete it first — checkout blocks payments until then.

> Testing option: use **Test mode** (swap keys). But since the code already targets live, the recommendation is to smoke-test with a small real transaction (step 6).

---

## 2. Create the 9 prices

Prices must be **Recurring monthly** in **USD**. Create them in the dashboard (NEVER via API — real money is involved and the code expects the IDs).

For each plan:

1. **Products** (`https://dashboard.stripe.com/products`) → **Add product**.
2. Name it (recommended so the mapping is obvious):

| Product | Type | Interval | Amount | Features |
|---|---|---|---|---|
| `Developer Starter` | Recurring | Monthly | `$49.00` | up to 50 properties |
| `Developer Pro` | Recurring | Monthly | `$99.00` | up to 200 properties |
| `Developer Enterprise` | Recurring | Monthly | `$299.00` | unlimited |
| `Broker Starter` | Recurring | Monthly | `$39.00` | up to 25 properties |
| `Broker Pro` | Recurring | Monthly | `$79.00` | up to 100 properties |
| `Broker Enterprise` | Recurring | Monthly | `$199.00` | unlimited |
| `Private Seller Single` | Recurring | Monthly | `$29.00` | 1 property |
| `Private Seller Starter` | Recurring | Monthly | `$49.00` | up to 20 properties |
| `Private Seller Pro` | Recurring | Monthly | `$99.00` | unlimited |

3. **Pricing** → **Recurring** → **Monthly** → amount in USD.
4. Save. Other fields (tax code, statement descriptor) are optional.

**Get the price IDs:**

- On each product page the price ID appears (starts with `price_1...`).
- Map them and share them like this:

```
DEVELOPER_STARTER_PRICE_ID    = price_1...
DEVELOPER_PRO_PRICE_ID        = price_1...
DEVELOPER_ENTERPRISE_PRICE_ID = price_1...
BROKER_STARTER_PRICE_ID       = price_1...
BROKER_PRO_PRICE_ID           = price_1...
BROKER_ENTERPRISE_PRICE_ID    = price_1...
PRIVATE_SINGLE_PRICE_ID       = price_1...
PRIVATE_STARTER_PRICE_ID      = price_1...
PRIVATE_PRO_PRICE_ID          = price_1...
```

---

## 3. Create the webhook endpoint

1. **Developers → Webhooks** (`https://dashboard.stripe.com/webhooks`) → **Add endpoint**.
2. **Endpoint URL:** `https://www.offplaninternational.com/api/webhooks/stripe`.
3. **Events** — select exactly these 5:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. **Add endpoint**.
5. On the endpoint page there is a **Signing secret** → **Reveal** and copy the `whsec_...`. That's `STRIPE_WEBHOOK_SECRET`. Share it.
6. (Optional) Send a test event from that page to verify delivery (it will fail signature verification until `.env` is populated — expected).
7. (Recommended) Set enabled payment methods in **Settings → Payment methods**.

---

## 4. Enable the Customer Portal

This lets users manage/upgrade/cancel their subscription and update payment methods (the "Manage Subscription" and "Manage Payment Method" buttons point here).

1. **Settings → Billing → Customer portal** (`https://dashboard.stripe.com/settings/billing/portal`).
2. **Activate** / configure:
   - **Business profile**: name, logo, colors (optional).
   - **Allowed features** (recommended):
     - *Subscription management*: ON
     - *Plan changes*: ON (the portal handles prorating automatically)
     - *Cancellations*: OFF (cancellations/downgrades go through our flow, which reverts to Free at period end)
     - *Payment methods*: ON
     - *Payment history / Invoices*: ON
3. **Default return URL:** `https://www.offplaninternational.com/app/billing`.
4. Save.

---

## 5. Values to share

1. The **9 `price_id`s** (step 2).
2. The **`whsec_...`** (step 3).
3. The **`SUPABASE_SERVICE_ROLE_KEY`** (Supabase → Settings → API, `service_role` key, NOT anon/publishable).

With those, `.env` is populated, tsc/eslint/build re-run, and the live smoke test happens.

---

## 6. Live smoke test (after `.env` is populated)

1. Deploy / run the site.
2. Register a test broker account → complete onboarding → pick **Broker Starter ($39)** → should redirect to Stripe checkout.
3. Pay with a real card. Verify on the endpoint (Webhooks → endpoint → "View retries/logs") that `checkout.session.completed` and `customer.subscription.updated` arrive, and the DB subscription flips to paid.
4. `/app/billing` → verify the plan shows **Starter $39/mo**, "Manage Subscription" opens the Portal, and the `?upgraded=true` toast appears.
5. (Optional) List a 2nd property to confirm the limit enforcement (on a *Private Seller Single* account, the 2nd active listing is blocked).
6. Test cancellation from the app (`changePlan("free")`) → confirm it schedules the cancellation and that at period end the webhook downgrades to Free and inactivates the excess listings.

---

## Blocker summary

| # | What | Where | Needed |
|---|---|---|---|
| 1 | 9 prices | Stripe → Products | 9 `price_id` |
| 2 | Webhook endpoint + 5 events | Stripe → Developers → Webhooks | `whsec_...` |
| 3 | Customer Portal with return `/app/billing` | Stripe → Settings → Billing → Portal | dashboard config |
| 4 | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | `service_role` key |
| 5 | Populate `.env` | repo | all of the above |