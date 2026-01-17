import { createTranslator, normalizeLocale, type Locale } from "./messages";

export function getClientLocale(): Locale {
  if (typeof document === "undefined") {
    return "fr";
  }

  const match = document.cookie
    .split("; ")
    .find((item) => item.startsWith("locale="));
  const value = match?.split("=")[1];
  return normalizeLocale(value) ?? "fr";
}

export function useClientTranslator() {
  const locale = getClientLocale();
  return { locale, t: createTranslator(locale) };
}
