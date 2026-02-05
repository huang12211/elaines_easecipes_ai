import type { Metadata } from "next";
import { ABeeZee, Inter } from "next/font/google";
import "./globals.css";

const abeezee = ABeeZee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abeezee",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Elaine's Easecipes",
  description: "Delicious recipes made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${abeezee.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
