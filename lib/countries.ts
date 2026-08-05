const ISO_CODES = new Set(["AE", "GB", "ES", "PT", "MX", "BR", "AR", "ID", "ME"]);

const CODE_BY_NAME: Record<string, string> = {
  "united arab emirates": "AE",
  "united kingdom": "GB",
  spain: "ES",
  portugal: "PT",
  mexico: "MX",
  brazil: "BR",
  argentina: "AR",
  indonesia: "ID",
  montenegro: "ME",
};

export function getCountryCode(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (ISO_CODES.has(trimmed.toUpperCase())) return trimmed.toUpperCase();
  return CODE_BY_NAME[trimmed.toLowerCase()] ?? "";
}

export function getCountryLabel(value: string | null | undefined): string {
  const code = getCountryCode(value);
  if (!code) return value ?? "";
  return Object.keys(CODE_BY_NAME).find((k) => CODE_BY_NAME[k] === code) ?? code;
}
