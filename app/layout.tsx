import type { Metadata } from "next";
import { Geist, Asap_Condensed } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html
      lang="sk"
      className={`${geistSans.variable} ${asapCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-gray-900 bg-white">
        {!hasClerkKeys && (
          <div className="bg-amber-50 border-b border-amber-200 p-2 text-center text-xs text-amber-800 font-medium z-50">
            ⚠️ Konfigurácia Clerk Auth chýba. Prihlasovanie a chránené zóny nebudú funkčné.
          </div>
        )}
        {children}
      </body>
    </html>
  );

  if (hasClerkKeys) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
