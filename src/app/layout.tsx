import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { getTranslator } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNest Online Bookstore",
  description: "Browse and buy books with BookNest.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getTranslator();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#f8f3ed] text-[#1f1a17] antialiased`}
      >
        <Providers>
          <Header
            labels={{
              books: t("nav.books"),
              orders: t("nav.orders"),
              account: t("nav.account"),
              admin: t("nav.admin"),
              cart: t("nav.cart"),
              login: t("nav.login"),
              logout: t("nav.logout"),
              language: t("nav.language"),
            }}
            locale={locale}
          />
          <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
        {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
