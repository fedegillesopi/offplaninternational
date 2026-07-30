"use client"

import { useEffect, useRef } from "react"

export function ContactFormEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const initedRef = useRef(false)

  useEffect(() => {
    if (initedRef.current) return
    initedRef.current = true

    const container = containerRef.current
    if (!container) return

    const iframe = document.createElement("iframe")
    iframe.src = "https://link.systemisedtoscale.com/widget/form/krJaiRDIiM6T2bl3oHI7"
    iframe.style.width = "100%"
    iframe.style.height = "593px"
    iframe.style.border = "none"
    iframe.style.borderRadius = "3px"
    iframe.id = "inline-krJaiRDIiM6T2bl3oHI7"
    iframe.setAttribute("data-layout", '{"id":"INLINE"}')
    iframe.setAttribute("data-trigger-type", "alwaysShow")
    iframe.setAttribute("data-trigger-value", "")
    iframe.setAttribute("data-activation-type", "alwaysActivated")
    iframe.setAttribute("data-activation-value", "")
    iframe.setAttribute("data-deactivation-type", "neverDeactivate")
    iframe.setAttribute("data-deactivation-value", "")
    iframe.setAttribute("data-form-name", "Website Contact Us")
    iframe.setAttribute("data-height", "593")
    iframe.setAttribute("data-layout-iframe-id", "inline-krJaiRDIiM6T2bl3oHI7")
    iframe.setAttribute("data-form-id", "krJaiRDIiM6T2bl3oHI7")
    iframe.title = "Website Contact Us"

    container.appendChild(iframe)

    const script = document.createElement("script")
    script.src = "https://link.systemisedtoscale.com/js/form_embed.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      try { if (script.parentNode) script.parentNode.removeChild(script) } catch { /* ok */ }
    }
  }, [])

  return <div ref={containerRef} />
}
