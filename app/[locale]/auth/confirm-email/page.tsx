"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"
import { Mail, CheckCircle2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const locale = useLocale()
  const [cooldown, setCooldown] = useState(0)
  const [sent, setSent] = useState(false)

  const t = (key: string) => {
    // inline translations — we could use useTranslations but this avoids
    // loading all auth messages for a simple page
    const msgs: Record<string, Record<string, string>> = {
      en: {
        title: "Check your email",
        description: "We sent a confirmation link to:",
        instruction: "Click the link in the email to verify your account and continue with the onboarding.",
        resend: "I didn't receive the email",
        resend_cooldown: "Resend in {s}s",
        success: "Email resent successfully",
      },
      es: {
        title: "Revisa tu correo",
        description: "Enviamos un enlace de confirmación a:",
        instruction: "Haz clic en el enlace del correo para verificar tu cuenta y continuar con la incorporación.",
        resend: "No recibí el correo",
        resend_cooldown: "Reenviar en {s}s",
        success: "Correo reenviado exitosamente",
      },
      pt: {
        title: "Verifique o seu e-mail",
        description: "Enviámos um link de confirmação para:",
        instruction: "Clique no link do e-mail para verificar a sua conta e continuar com a integração.",
        resend: "Não recebi o e-mail",
        resend_cooldown: "Reenviar em {s}s",
        success: "E-mail reenviado com sucesso",
      },
    }

    const lang = locale === "ae" || locale === "gb" ? "en" :
                 locale === "br" || locale === "pt" ? "pt" : "es"
    return msgs[lang]?.[key] ?? key
  }

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = async () => {
    if (cooldown > 0 || !email) return
    const supabase = createClient()
    await supabase.auth.resend({ type: "signup", email })
    setSent(true)
    setCooldown(30)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-3">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-1">
          {t("description")}
        </p>
        <p className="font-medium mb-6">{email || "your email"}</p>
        <p className="text-sm text-muted-foreground mb-8">
          {t("instruction")}
        </p>

        {sent && (
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <span>{t("success")}</span>
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-sm text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline"
        >
          {cooldown > 0 ? (
            <span className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              {t("resend_cooldown").replace("{s}", String(cooldown))}
            </span>
          ) : (
            t("resend")
          )}
        </button>
      </div>
    </div>
  )
}
