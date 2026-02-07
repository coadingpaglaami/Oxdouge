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
  title: "Notoverland Tech",
  description: "Welcome to Notoverland Tech",
  icons: {
    icon: "/landing/logo.svg",
  },
  openGraph: {
    title: "Notoverland Tech",
    description: "Welcome to Notoverland Tech",
    images: [
      {
        url: "https://notoverlandtech.com/landing/logo.png",
        height: 630,
        width: 1200,
        alt: "Notoverland Tech",
      },
    ],
    type: "website",
    siteName: "Notoverland Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notoverland Tech",
    description: "Welcome to Notoverland Tech",
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
