import { cookies, headers } from "next/headers";
import { createTranslator, normalizeLocale, type Locale } from "./messages";

function readCookieValueFromHeader(headerValue: string, name: string) {
  const match = headerValue
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));
  return match?.split("=")[1];
}

async function resolveHeaders() {
  return await Promise.resolve(headers());
}

async function resolveCookies() {
  return await Promise.resolve(cookies());
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await resolveCookies();
  const cookieValue =
    typeof cookieStore?.get === "function"
      ? cookieStore.get("locale")?.value
      : undefined;
  const cookieLocale = normalizeLocale(cookieValue);
  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await resolveHeaders();
  const headerCookie =
    typeof headerStore?.get === "function"
      ? headerStore.get("cookie") ?? ""
      : "";
  const headerCookieLocale = normalizeLocale(
    readCookieValueFromHeader(headerCookie, "locale")
  );
  if (headerCookieLocale) {
    return headerCookieLocale;
  }

  const acceptLanguage =
    typeof headerStore?.get === "function"
      ? headerStore.get("accept-language")
      : undefined;
  const headerLocale = normalizeLocale(acceptLanguage ?? "");
  return headerLocale ?? "fr";
}

export async function getTranslator() {
  const locale = await getLocale();
  return { locale, t: createTranslator(locale) };
}
