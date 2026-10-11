"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar, {
  SIDEBAR_WIDTH_OPEN,
  SIDEBAR_WIDTH_CLOSED,
} from "./Sidebar";

import { useAuth } from "@/context/AuthContext";

const SIDEBAR_MARGIN = 20;

const PUBLIC_ROUTES = ["/login", "/register"];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, loading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // ==========================================================
  // ROUTE PROTECTION
  // ==========================================================

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace("/dashboard");
    }
  }, [
    isAuthenticated,
    loading,
    isPublicRoute,
    pathname,
    router,
  ]);

  // ==========================================================
  // AUTH LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121026]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />

          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-300">
            Loading your journal
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PUBLIC PAGES
  // ==========================================================

  if (isPublicRoute) {
    return <>{children}</>;
  }

  // ==========================================================
  // REDIRECT LOADING
  // ==========================================================

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121026]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
            Redirecting to login
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // SIDEBAR + PROTECTED PAGE
  // ==========================================================

  const width = isOpen
    ? SIDEBAR_WIDTH_OPEN
    : SIDEBAR_WIDTH_CLOSED;

  return (
    <>
      <Sidebar
        isOpen={isOpen}
        onToggle={() => setIsOpen((value) => !value)}
      />

      <div
        style={{
          marginLeft: width + SIDEBAR_MARGIN * 2,
          transition: "margin-left 0.12s ease",
          minHeight: "100vh",
          background: "#121026",
        }}
      >
        {children}
      </div>
    </>
  );
}