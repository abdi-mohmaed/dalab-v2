import type { Metadata } from "next";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { MainLayout } from "@/layouts/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dalab",
  description: "Professional Mobile Marketplace",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dalab",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

import Link from 'next/link'; // Not used but good practice checks
import { BottomNav } from "@/components/BottomNav";
import { CSPostHogProvider } from "@/components/providers/PostHogProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { DashboardProvider } from "@/context/DashboardContext";
import { StoreProvider } from "@/context/StoreContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <CSPostHogProvider>
            <AuthProvider>
              <StoreProvider>
                <CartProvider>
                  <WishlistProvider>
                    <DashboardProvider>
                      <MainLayout>{children}</MainLayout>
                    </DashboardProvider>
                  </WishlistProvider>
                </CartProvider>
              </StoreProvider>
            </AuthProvider>
          </CSPostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
