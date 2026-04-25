import type { Metadata } from "next";
import { ABeeZee, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  title: {
    template: "%s | Elaine's Easecipes",
    default: "Elaine's Easecipes",
  },
  description: "Elaine's Easecipes is a collection of delicious recipes made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${abeezee.variable} ${inter.variable} h-auto w-full antialiased`}>
        <div className="bg-white min-h-screen w-full max-w-[1440px] mx-auto relative">
          <Header />
          {/* <div className="min-h-[calc(100vh-53px-80px)] sm:min-h-[calc(100vh-60px-100px)] xl:min-h-[calc(100vh-64px-116px)]"> Adjusted for header and footer height */}
          <div>
            {children}
          </div>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
