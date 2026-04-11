import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCountdown from "@/components/StickyCountdown";
import TrackingCapture from "@/app/TrackingCapture";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI with Michal — Workshops, Mentoring & AI Implementation",
  description:
    "Accelerate your AI adoption with live workshops, 1-on-1 mentoring, and implementation services. Led by Michal Juhas and team — for individuals, solopreneurs, and companies.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://aiwithmichal.com"
  ),
  openGraph: {
    title: "AI with Michal — Workshops, Mentoring & AI Implementation",
    description:
      "Accelerate your AI adoption with live workshops, 1-on-1 mentoring, and implementation services for individuals and teams.",
    siteName: "AI with Michal",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Michal-Juhas-headshot-square-v1.jpg",
        width: 800,
        height: 800,
        alt: "Michal Juhas — AI with Michal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI with Michal — Workshops, Mentoring & AI Implementation",
    description:
      "Accelerate your AI adoption with live workshops, 1-on-1 mentoring, and implementation services for individuals and teams.",
    images: ["/Michal-Juhas-headshot-square-v1.jpg"],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/login" signUpUrl="/register">
      <html lang="en" className={`${inter.variable} h-full`}>
        <head />
        <body className="min-h-full antialiased">
          {/* GTM noscript fallback */}
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
          <TrackingCapture />
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
          {/* Spacer so footer isn't hidden behind the sticky countdown bar */}
          <div className="h-16" />
          <StickyCountdown />

          {/* GTM */}
          {GTM_ID && (
            <Script
              id="gtm"
              strategy="afterInteractive"
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
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1227582702838805');fbq('track','PageView');`,
            }}
          />

          {/* LinkedIn Insight Tag */}
          <Script
            id="linkedin-insight"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `_linkedin_partner_id = "8715026";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`,
            }}
          />
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} alt="" src="https://px.ads.linkedin.com/collect/?pid=8715026&fmt=gif" />
          </noscript>
        </body>
      </html>
    </ClerkProvider>
  );
}
