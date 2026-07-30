# Plan de implementación — Nuevo flujo de Onboarding

## Resumen del flujo

```
SignUp → Confirm Email → Onboarding → Payment → Dashboard
```

---

## 1. Sign Up — `/[locale]/auth/sign-up/[role]`

**Archivos a modificar:**
- `components/auth/sign-up-form.tsx`

### Formulario
Sin cambios estructurales. Se mantienen todos los campos actuales:
- Role tabs (Developer/Broker/Private Seller)
- Full Name
- Email
- Password
- Repeat Password

### Cambios en submit

1. Antes de llamar a `signUp()`, validar si el email ya existe:
   - Intentar `signUp()` con email + password
   - Si error `"User already registered"` → mostrar mensaje "Este correo ya está registrado" (traducido)
   - Si éxito → redirigir a **`/auth/confirm-email?email=X`** (en vez de `/auth/sign-up-success`)

2. `emailRedirectTo` se mantiene igual: `${origin}/${locale}/auth/confirm`

---

## 2. Confirm Email — `/[locale]/auth/confirm-email`

**Archivos nuevos:**
- `app/[locale]/auth/confirm-email/page.tsx`

### Página

```
+------------------------------------------+
|                                          |
|  [Icon: Mail]                            |
|                                          |
|  Check your email                        |
|                                          |
|  We sent a confirmation link to:         |
|  [email desde query param]               |
|                                          |
|  Click the link in the email to verify   |
|  your account and continue.              |
|                                          |
|  ┌──────────────────────────────┐        |
|  │  I didn't receive the email  │        |
|  └──────────────────────────────┘        |
|                                          |
+------------------------------------------+
```

### "I didn't receive the email"
- Client component inline en la página
- Lee email de `useSearchParams()`
- Al hacer clic → `supabase.auth.resend({ type: 'signup', email })`
- Deshabilitar botón 30s con cuenta regresiva

### Reemplaza
- `app/[locale]/auth/sign-up-success/page.tsx` → se elimina

---

## 3. Confirm Route — `/[locale]/auth/confirm`

**Sin cambios.** Ya redirige correctamente:
- Profile no completado → `/{locale}/auth/onboarding/{role}`
- Profile completado → `/app`

---

## 4. Onboarding — `/[locale]/auth/onboarding/[role]`

**Archivos a modificar:**
- `app/[locale]/auth/onboarding/[role]/page.tsx`

### Formularios por rol (sin cambios vs actual)

**Developer:**
| Campo | Requerido |
|-------|-----------|
| Phone number | ✅ |
| Operating country | ✅ |
| Company name | ✅ |
| Company website | ❌ |

**Broker:**
| Campo | Requerido |
|-------|-----------|
| Phone number | ✅ |
| Operating country | ✅ |
| License number | ✅ |
| Company name | ✅ |
| Company website | ❌ |

**Private Seller:**
| Campo | Requerido |
|-------|-----------|
| Phone number | ✅ |
| Country of residence | ✅ |

### Cambio único

| | Actual | Nuevo |
|--|--------|-------|
| Redirect post-submit | `/app` | **`/auth/payment`** |

Usar `useRouter` de `next/navigation` + `useLocale()` de `next-intl`:
```typescript
router.push(`/${locale}/auth/payment`);
```

---

## 5. Payment — `/[locale]/auth/payment`

**Archivos nuevos:**
- `app/[locale]/auth/payment/page.tsx`

### Server component (page.tsx)

```
1. createClient() + getUser()
2. Leer user_profiles: role, operating_country, country_of_residence
3. Determinar país:
   - Developer/Broker → operating_country
   - Private Seller → country_of_residence
4. getPricingPlan(role, country) de lib/pricing-plans.ts
5. Renderizar UI
```

### UI

```
+------------------------------------------+
|                                          |
|  Choose your plan                        |
|                                          |
|  [Card con pricing plan]                 |
|  ┌──────────────────────────────┐        |
|  │  Plan: Business              │        |
|  │  Price: $199/month           │        |
|  │  ✓ Unlimited listings        │        |
|  │  ✓ Analytics dashboard       │        |
|  │  ✓ Priority support          │        |
|  └──────────────────────────────┘        |
|                                          |
|  ┌──────────────────────────────┐        |
|  │     Select Plan / Continue   │        |
|  └──────────────────────────────┘        |
|                                          |
|  [Skip for now]                          |
+------------------------------------------+
```

### Comportamiento
- Botón "Select Plan" / "Continue" → placeholder, redirige a `/app`
- Link "Skip for now" → redirige a `/app`

### Traducciones
- Agregar namespace `auth.payment` en `messages/{locale}.json`

---

## 6. Dashboard — `/app`

**Sin cambios.**

---

## Resumen de archivos

### Archivos nuevos (2)
| Ruta | Tipo |
|------|------|
| `app/[locale]/auth/confirm-email/page.tsx` | Server + Client inline |
| `app/[locale]/auth/payment/page.tsx` | Server component |

### Archivos a modificar (3)
| Ruta | Cambio |
|------|--------|
| `components/auth/sign-up-form.tsx` | Validar email existente, redirect a `/auth/confirm-email` |
| `app/[locale]/auth/onboarding/[role]/page.tsx` | Redirect a `/auth/payment` en vez de `/app` |
| `messages/{locale}.json` (7 archivos) | Agregar namespaces: `confirm_email`, `payment` |

### Archivos a eliminar (1)
| Ruta | Motivo |
|------|--------|
| `app/[locale]/auth/sign-up-success/page.tsx` | Reemplazada por `/auth/confirm-email` |

---

## Consideraciones

### 1. País para pricing
- Developer/Broker → `operating_country` (seteado en onboarding)
- Private Seller → `country_of_residence` (seteado en onboarding)
- Fallback en `getPricingPlan()` si no hay país

### 2. Rate limiting en resend email
- Supabase rate limita resend OTP
- Deshabilitar botón 30s con contador visual

### 3. i18n router vs next/router en redirects

| Redirect | Router | Motivo |
|----------|--------|--------|
| `/auth/confirm-email` (desde sign-up) | `@/i18n/navigation` | Bajo `[locale]` |
| `/auth/onboarding/{role}` (desde confirm route) | `redirect` de `next/navigation` con `/${locale}/...` | Route handler |
| `/auth/payment` (desde onboarding) | `next/navigation` + `useLocale()` | Bajo `[locale]` |
| `/app` (desde payment) | `next/navigation` | Sin locale prefix |

### 4. Flujo completo

```
/[locale]/auth/sign-up/[role]
       ↓ (submit con password)
/[locale]/auth/confirm-email?email=X
       ↓ (clic en link del email)
/[locale]/auth/confirm?token_hash=...&type=signup
       ↓ (verifyOtp + leer user_profiles)
/[locale]/auth/onboarding/[role]
       ↓ (completar datos + profile_completed=true)
/[locale]/auth/payment
       ↓ (seleccionar plan / skip)
/app
```
