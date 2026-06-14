import type { Metadata } from "next";
import { Cinzel, Inter, Montserrat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { localBusinessSchema } from "@/lib/schema";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://majesticpinerenovations.com",
  ),
  title: SITE_NAME,
  description:
    "Remodeling and construction for homes, cabins, and commercial spaces across Buffalo, the Twin Cities, and the Whitefish Chain area.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <SchemaScript data={localBusinessSchema()} />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
