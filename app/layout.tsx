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
  title: "Build AI-Powered Talent Pools Outside LinkedIn | AI with Michal",
  description:
    "Learn how to discover and analyze candidates using alternative data sources and AI. Live 90-minute implementation workshop with Michal Juhas.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://aiwithmichal.com"
  ),
  openGraph: {
    title: "Build AI-Powered Talent Pools Outside LinkedIn",
    description:
      "Stop searching the same LinkedIn profiles as everyone else. Learn AI-powered talent discovery.",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "Build Your Own AI Talent Pool – Live Workshop · April 2, 2026 · 90 Min",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build AI-Powered Talent Pools Outside LinkedIn",
    description:
      "Stop searching the same LinkedIn profiles as everyone else. Learn AI-powered talent discovery.",
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
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroups onFeatureFlags addFeatureFlagsHandler onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_i292SIJ4O9YYS4XT7QRCphQ2aXfNnOYHbjMEvol7z5y', {
        api_host: 'https://tmr.aiwithmichal.com',
        defaults: '2026-01-30'
    })`,
            }}
          />
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
