import type { Metadata } from "next";
import "./globals.css";

import { Playfair_Display, Inter } from "next/font/google";

// IMPORT ADD //
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SBS Financial Services",
  description:
    "Premium financial planning and wealth management services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${playfair.variable}
          ${inter.variable}
          font-sans
          antialiased bg-sbs-cream text-sbs-charcoal
        `}
      >
        {/* NAVBAR ADD */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main>{children}</main>

        {/* FOOTER ADD */}
        <Footer />
      </body>
    </html>
  );
}