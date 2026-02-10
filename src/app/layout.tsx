import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const defaultDescription =
  "A modern financial tool that makes finance feel effortless. MoneyBear is designed for people who want clarity without complexity.";

export const metadata: Metadata = {
  metadataBase: new URL("https://moneybear.eu"),
  title: {
    default: "MoneyBear",
    template: "%s | MoneyBear",
  },
  description: defaultDescription,
  openGraph: {
    title: "MoneyBear",
    description: defaultDescription,
    url: "https://moneybear.eu",
    siteName: "MoneyBear",
    type: "website",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "MoneyBear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyBear",
    description: defaultDescription,
    images: ["/og-home.png"],
  },
  icons: {
    icon: [{ url: "/Moneybearlogo.svg", type: "image/svg+xml" }],
    shortcut: "/Moneybearlogo.svg",
    apple: "/Moneybearlogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
