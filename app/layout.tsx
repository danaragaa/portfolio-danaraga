import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danaraga.dev"),
  title: {
    default: "Dana Raga | Full-Stack Developer",
    template: "%s | Dana Raga",
  },
  description:
    "Portfolio Dana Raga, full-stack developer yang membangun website dan aplikasi modern dengan performa tinggi.",
  openGraph: {
    title: "Dana Raga | Full-Stack Developer",
    description:
      "Portfolio Dana Raga: project, pengalaman, dan cara kerja untuk membangun produk digital modern.",
    url: "https://danaraga.dev",
    siteName: "Dana Raga Portfolio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dana Raga | Full-Stack Developer",
    description:
      "Portfolio Dana Raga: project, pengalaman, dan layanan pengembangan website modern.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleScriptSrc =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC ??
    "https://plausible.io/js/script.js";

  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        {children}
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
        {plausibleDomain && (
          <Script
            src={plausibleScriptSrc}
            data-domain={plausibleDomain}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
