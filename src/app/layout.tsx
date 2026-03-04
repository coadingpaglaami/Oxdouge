import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserLayout from "./(main)/UserLayOut";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Not Overland Tech | N.O.T",
  description: "Outdoor and overland gears without the overland tax. Committed to provide you with the most reliable and affordable solution for your adventures.",
  icons: {
    icon: "/landing/logo.svg",
  },
  openGraph: {
    title: "Not Overland Tech | N.O.T",
    description: "Outdoor and overland gears without the overland tax. Committed to provide you with the most reliable and affordable solution for your adventures.",
    images: [
      {
        url: "https://notoverlandtech.com/landing/logo.png",
        height: 630,
        width: 1200,
        alt: "Not Overland Tech",
      },
    ],
    type: "website",
    siteName: "Not Overland Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Not Overland Tech | N.O.T",
    description: "Outdoor and overland gears without the overland tax. Committed to provide you with the most reliable and affordable solution for your adventures.",
    images: ["https://notoverlandtech.com/landing/logo.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserLayout>{children}</UserLayout>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
