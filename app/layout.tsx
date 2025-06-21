import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Brat Generator | Create Unique Brat Style Designs & Text",
    template: "%s | Brat Generator Tool"
  },
  description: "Generate brat style designs, text, and images with our free online Brat Generator. Perfect for creating brat aesthetic visuals, Charli XCX inspired designs, and social media content.",
  keywords: [
    "Brat Generator",
    "brat text generator",
    "brat font generator",
    "brat generator Charli XCX",
    "brat cover generator",
    "brat generator free",
    "brat image generator",
    "free brat generator",
    "brat aesthetic generator",
    "brat style creator"
  ],
  openGraph: {
    title: "Brat Generator | Create Unique Brat Style Designs",
    description: "Free online tool to generate brat aesthetic text, images, and designs inspired by Charli XCX and pop culture.",
    url: "https://bratgenerators.org",
    siteName: "Brat Generator",
    images: [
      {
        url: "https://bratgenerators.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brat Generator Tool Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brat Generator | Create Unique Brat Style Designs",
    description: "Free online tool to generate brat aesthetic text, images, and designs inspired by Charli XCX and pop culture.",
    images: ["https://bratgenerators.org/og-image.jpg"],
  },
  alternates: {
    canonical: "https://bratgenerators.org",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}