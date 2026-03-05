import type { Metadata } from "next";
import { Geist, Asap_Condensed } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const asapCondensed = Asap_Condensed({
  variable: "--font-asap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SportWell | Športovo rehabilitačné centrum v Bratislave",
  description: "Moderné rehabilitačné a športové centrum s inteligentnými rezerváciami.",
};

const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder');

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const { lang = 'sk' } = await params;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'SportWell',
    'image': 'https://sportwell.sk/logo.png',
    '@id': 'https://sportwell.sk',
    'url': 'https://sportwell.sk',
    'telephone': '+421123456789',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Ulica 123',
      'addressLocality': 'Bratislava',
      'postalCode': '81101',
      'addressCountry': 'SK'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 48.1486,
      'longitude': 17.1077
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      'opens': '08:00',
      'closes': '21:00'
    }
  };

  const content = (
    <html
      lang={lang}
      className={`${geistSans.variable} ${asapCondensed.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${asapCondensed.variable} min-h-full flex flex-col font-sans text-gray-900 bg-white`}>
        <div className="z-50 flex flex-col sticky top-0">
          {!hasClerkKeys && (
            <div className="bg-amber-50 border-b border-amber-100 p-2 text-center text-xs text-amber-800 font-medium">
              ⚠️ Konfigurácia Clerk Auth chýba. Prihlasovanie a chránené zóny nebudú funkčné.
            </div>
          )}
          {process.env.DATABASE_URL?.includes('localhost') && (
            <div className="bg-blue-50 border-b border-blue-100 p-1 text-center text-[10px] text-blue-700 font-normal">
              ℹ️ Režim lokálnej databázy. Ak vidíte chyby pri načítaní dát, uistite sa, že Docker/Postgres beží.
            </div>
          )}
        </div>
        {children}
      </body>
    </html>
  );

  if (hasClerkKeys) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
