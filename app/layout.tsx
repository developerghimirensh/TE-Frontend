import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/context/AuthContext";

/* -------------------------------------------------------------------------- */
/* Fonts                                                                      */
/* -------------------------------------------------------------------------- */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: {
    default: "The Millionaire Diary",
    template: "%s | The Millionaire Diary",
  },
  description: "Your personal trading journal and performance dashboard.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

/* -------------------------------------------------------------------------- */
/* Root Layout                                                                */
/* -------------------------------------------------------------------------- */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${spaceGrotesk.variable}
          ${inter.variable}
          min-h-screen
          bg-[#121026]
          text-violet-50
          antialiased
        `}
        style={{
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        <AuthProvider>
          <div className="min-h-screen bg-[#121026]">
            <AppShell>
              <main className="min-h-screen bg-[#121026]">
                {children}
              </main>
            </AppShell>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
