import type { Metadata, Viewport } from "next";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coimbatore Transit — Live Bus Tracker & Digital Ticketing",
  description: "Real-time Coimbatore city bus tracking, ETAs, route schedules, and digital QR passes for over 100+ routes",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Coimbatore Transit",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <Navigation />
          {/* Main content with padding for top header & bottom nav */}
          <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
