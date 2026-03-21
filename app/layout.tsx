import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCountdown from "@/components/StickyCountdown";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Live AI Recruiting Workshop for Recruiters | AI with Michal",
  description:
    "Live 90-minute AI recruiting workshop for recruiters and talent teams. Learn practical workflows for talent pools, candidate pre-screening, and recruiting automation with Michal Juhas.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://aiwithmichal.com"
  ),
  openGraph: {
    title: "Live AI Recruiting Workshop for Recruiters",
    description:
      "A live 90-minute workshop for recruiters and talent teams. Learn how to use AI for sourcing, pre-screening, and practical recruiting workflows.",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "Live AI Recruiting Workshop for Recruiters · April 2, 2026 · 90 Min",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live AI Recruiting Workshop for Recruiters",
    description:
      "A live 90-minute workshop for recruiters and talent teams. Learn how to use AI for sourcing, pre-screening, and practical recruiting workflows.",
    images: ["/workshop-og.jpeg"],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`}>
        <head>
          {GTM_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
              }}
            />
          )}
          {/* Meta Pixel */}
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1227582702838805');fbq('track','PageView');`,
            }}
          />
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1227582702838805&ev=PageView&noscript=1" alt="" />
          </noscript>
        </head>
        <body className="min-h-full antialiased">
          {GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
          {/* Spacer so footer isn't hidden behind the sticky countdown bar */}
          <div className="h-16" />
          <StickyCountdown />
        </body>
      </html>
    </ClerkProvider>
  );
}
