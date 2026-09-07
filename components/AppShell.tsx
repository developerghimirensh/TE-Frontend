"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar, {
SIDEBAR_WIDTH_OPEN,
SIDEBAR_WIDTH_CLOSED,
} from "./Sidebar";

import { useAuth } from "@/context/AuthContext";

const SIDEBAR_MARGIN = 20;

const PUBLIC_ROUTES = [
"/login",
"/register",
];

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
if (loading) {
return;
}

// --------------------------------------------------------
// NOT LOGGED IN
// --------------------------------------------------------

if (!isAuthenticated && !isPublicRoute) {
  router.replace("/login");
  return;
}

// --------------------------------------------------------
// ALREADY LOGGED IN
// --------------------------------------------------------

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
// AUTH CHECK LOADING
// ==========================================================

if (loading) {
return ( <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center"> <div className="text-sm text-gray-500">
Loading... </div> </div>
);
}

// ==========================================================
// PUBLIC PAGES
// ==========================================================

if (isPublicRoute) {
return <>{children}</>;
}

// ==========================================================
// PROTECTED PAGE
// ==========================================================

if (!isAuthenticated) {
return ( <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center"> <div className="text-sm text-gray-500">
Redirecting to login... </div> </div>
);
}

// ==========================================================
// SIDEBAR
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
      marginLeft:
        width + SIDEBAR_MARGIN * 2,
      transition:
        "margin-left 0.25s ease",
    }}
  >
    {children}
  </div>
</>

);
}
