import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import React from "react";
import { GoogleAnalytics } from '@next/third-parties/google'


const arapix = localFont({
  src: "../fonts/Arapix.woff",
  variable: "--font-arapix",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NavidLabs",
  description: "Navid Shirmohammadi Blog",
  metadataBase: new URL("https://navidlabs.ir"),
  applicationName: "NavidLabs App",
};

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children, params: { locale },
}: Readonly<Props>) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={`${arapix.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GA_ID}`} />
    </html>
  );
}
