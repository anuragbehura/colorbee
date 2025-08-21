import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Navbar } from "@/components/Navbar";
import { RightSidebar } from "@/components/RightSidebar";
import LoadingBar from "@/components/LoadingBar";
import { Provider } from "@/api/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ColorBee🐝 - Your Community-Driven Color Palette Platform",
  description: "A vibrant web application that helps developers and designers discover, create, and share beautiful color combinations. ColorBee makes it easy to explore curated color palettes, copy hex codes with a single click, and contribute your own palettes to our growing collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true} lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full`}>

        {/* LoadingBar */}
        <LoadingBar />
        <Provider>

          {/* Navbar fixed at the top */}
          <div className="fixed top-0 z-50 w-screen bg-white">
            <Navbar />
          </div>

          {/* Main container with correct padding-top to account for fixed navbar */}
          <div className="flex h-screen pt-16">
            {/* Left sidebar - fixed position with independent scroll */}
            <div className="fixed left-0 w-52 h-[calc(100vh-64px)] border-r">
              <div className="h-full overflow-y-auto scrollbar-none">
                <LeftSidebar />
              </div>
            </div>

            {/* Main content - with left and right margin for sidebars */}
            <main className="flex-1 ml-64 mr-64 min-h-screen overflow-y-auto">
              <div className="container max-w-3xl mx-auto py-6 px-8">
                {children}
              </div>
            </main>

            {/* Right sidebar - fixed position */}
            <div className="fixed right-0 w-80 h-[calc(100vh-64px)] border-l">
              <RightSidebar />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}