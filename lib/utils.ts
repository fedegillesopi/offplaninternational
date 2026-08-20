import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function isHtmlText(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

// Convierte HTML ya sanitizado a texto plano para resúmenes sin estilos
// (ej. la card del listado). Decodifica entidades de vuelta a caracteres.
export function stripHtmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|h2|h3|li|blockquote|div)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function toEditorHtml(text: string): string {
  if (!text) return ""
  if (isHtmlText(text)) return text

  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

  return withBold
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.split("\n").join("<br>")}</p>`)
    .join("")
}
