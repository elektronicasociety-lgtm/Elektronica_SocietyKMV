import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ELEKTRONICA | Department of Electronics, Keshav Mahavidyalaya",
  description: "Official portal of ELEKTRONICA, the Electronics Society of Keshav Mahavidyalaya, University of Delhi. Innovating through Robotics, IoT, AI, VLSI, and Embedded Systems.",
  icons: {
    icon: "/society-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased bg-bg-primary text-text-primary min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}

