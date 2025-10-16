import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Navbar } from "@/components/Navbar";
import { RightSidebar } from "@/components/RightSidebar";
import LoadingBar from "@/components/LoadingBar";
import { Provider } from "@/api/Provider";
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
  title: "ColorBee🐝 - Your Community-Driven Color Palette Platform",
  description: "A vibrant web application that helps developers and designers discover, create, and share beautiful color combinations. ColorBee makes it easy to explore curated color palettes, copy hex codes with a single click, and contribute your own palettes to our growing collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        <LoadingBar />
        <Provider>
          {/* Navbar fixed at the top */}
          <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b">
            <Navbar />
          </div>

          {/* Main layout container */}
          <div className="fixed inset-0 top-16 flex">
            {/* Left sidebar - fixed with independent scroll */}
            <aside className="w-52 h-full border-r bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-none">
              <LeftSidebar />
            </aside>

            {/* Main content wrapper - this creates the scroll context */}
            <div className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-none">
              <main className="bg-white min-h-full">
                <div className="container max-w-6xl mx-auto p-6">
                  {children}
                  <Toaster />
                </div>
              </main>
            </div>

            {/* Right sidebar - fixed with independent scroll */}
            <aside className="w-80 h-full border-l bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <RightSidebar />
            </aside>
          </div>
        </Provider>
      </body>
    </html>
  );
}