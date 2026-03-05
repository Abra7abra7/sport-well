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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="sk"
        className={`${geistSans.variable} ${asapCondensed.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans text-gray-900 bg-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
