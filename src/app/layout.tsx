import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taleem Umerkot — AI Learning for Every Child",
  description:
    "An AI-powered education platform for Umerkot, Sindh. Every child deserves an opportunity to learn.",
  keywords: [
    "Taleem Umerkot",
    "Education",
    "Umerkot",
    "Sindh",
    "AI Learning",
    "Hackathon",
  ],
  authors: [{ name: "Taleem Umerkot Team" }],
  openGraph: {
    title: "Taleem Umerkot",
    description:
      "An AI-powered education platform for Umerkot, Sindh. Every child deserves an opportunity to learn.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
