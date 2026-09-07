import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Trade Journal",
  description: "Personal Trading Journal",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-[#f5f7f2]">
            <AppShell>
              <main className="">{children}</main>
            </AppShell>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
