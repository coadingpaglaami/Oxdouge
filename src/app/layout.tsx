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
  title: "Oxdouge Store",
  description: "Welcome to Oxdouge Store",
  icons: {
    icon: "/landing/logo.svg",
  },
  openGraph: {
    title: "Oxdouge Store",
    description: "Welcome to Oxdouge Store",
    images: [
      {
        url: "https://notoverland.com/landing/logo.svg",
        height: 630,
        width: 1200,
        alt: "Oxdouge Store",
      },
    ],
    type: "website",
    siteName: "Oxdouge Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxdouge Store",
    description: "Welcome to Oxdouge Store",
    images: ["https://notoverland.com/landing/logo.svg"],
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
