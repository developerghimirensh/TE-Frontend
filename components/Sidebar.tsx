"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
Home,
TrendingUp,
BarChart3,
PlusCircle,
User,
LogOut,
ChevronsLeft,
ChevronsRight,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

// ============================================================
// DESIGN
// ============================================================

const BG = "#e6e9ef";

export const SIDEBAR_WIDTH_OPEN = 260;
export const SIDEBAR_WIDTH_CLOSED = 88;

const SIDEBAR_MARGIN = 20;

// ============================================================
// NAVIGATION
// ============================================================

const NAV_ITEMS = [
{
label: "Dashboard",
icon: Home,
href: "/dashboard",
},
{
label: "Trades",
icon: TrendingUp,
href: "/trades",
},
{
label: "Analytics",
icon: BarChart3,
href: "/analytics",
},
{
label: "Add Trade",
icon: PlusCircle,
href: "/trades/new",
},
{
label: "User Profile",
icon: User,
href: "/profile",
},
];

// ============================================================
// TYPES
// ============================================================

type SidebarProps = {
isOpen: boolean;
onToggle: () => void;
};

// ============================================================
// SIDEBAR
// ============================================================

export default function Sidebar({
isOpen,
onToggle,
}: SidebarProps) {
const pathname = usePathname();
const router = useRouter();
const { logout } = useAuth();

const width = isOpen
? SIDEBAR_WIDTH_OPEN
: SIDEBAR_WIDTH_CLOSED;

// ==========================================================
// SIGN OUT
// ==========================================================



const handleSignOut = () => {
  logout();
  router.replace("/login");
};

// ==========================================================
// ACTIVE ROUTE CHECK
// ==========================================================

const isRouteActive = (href: string) => {
if (href === "/dashboard") {
return pathname === "/dashboard";
}

return pathname === href || pathname.startsWith(`${href}/`);

};

// ==========================================================
// RENDER
// ==========================================================

return (
<>
{/* ======================================================
SIDEBAR
====================================================== */}

  <aside
    style={{
      position: "fixed",
      top: "50%",
      transform: "translateY(-50%)",
      left: SIDEBAR_MARGIN,
      height: "80vh",
      width,
      background: BG,
      borderRadius: 28,
      padding: "24px 16px",
      boxShadow:
        "10px 10px 24px #c5c8ce, -10px -10px 24px #ffffff",
      transition: "width 0.25s ease",
      zIndex: 40,
      display: "flex",
      flexDirection: "column",
      alignItems: isOpen ? "stretch" : "center",
      gap: 14,
      overflow: "hidden",
    }}
  >
    {/* ====================================================
        LOGO
    ==================================================== */}

    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isOpen ? "flex-start" : "center",
        gap: 10,
        padding: isOpen ? "0 8px 20px" : "0 0 20px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: 12,
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 15,
          color: "#4a4e55",
          boxShadow:
            "4px 4px 8px #c5c8ce, -4px -4px 8px #ffffff",
        }}
      >
        TE
      </div>

      {isOpen && (
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#4a4e55",
            whiteSpace: "nowrap",
          }}
        >
          Trading Edge
        </span>
      )}
    </div>

    {/* ====================================================
        NAVIGATION
    ==================================================== */}

    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
      }}
    >
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const isActive = isRouteActive(href);

        return (
          <Link
            key={label}
            href={href}
            title={isOpen ? undefined : label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isOpen ? "flex-start" : "center",
              gap: 12,
              width: isOpen ? "100%" : 48,
              height: 48,
              padding: isOpen ? "0 16px" : 0,
              borderRadius: 14,
              background: BG,
              color: "#4a4e55",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              flexShrink: 0,
              boxShadow: isActive
                ? "inset 4px 4px 8px #c5c8ce, inset -4px -4px 8px #ffffff"
                : "4px 4px 8px #c5c8ce, -4px -4px 8px #ffffff",
              transition: "all 0.2s ease",
            }}
          >
            <Icon
              size={18}
              style={{
                flexShrink: 0,
              }}
            />

            {isOpen && (
              <span
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>

    {/* ====================================================
        SIGN OUT
    ==================================================== */}

    <div
      style={{
        marginTop: "auto",
        width: isOpen ? "100%" : "auto",
      }}
    >
      <button
        onClick={handleSignOut}
        title={isOpen ? undefined : "Sign Out"}
        style={{
          width: isOpen ? "100%" : 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "flex-start" : "center",
          gap: 12,
          padding: isOpen ? "0 16px" : 0,
          border: "none",
          borderRadius: 14,
          background: BG,
          color: "#b23b3b",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          boxShadow:
            "4px 4px 8px #c5c8ce, -4px -4px 8px #ffffff",
          transition: "all 0.2s ease",
        }}
      >
        <LogOut
          size={18}
          style={{
            flexShrink: 0,
          }}
        />

        {isOpen && (
          <span
            style={{
              whiteSpace: "nowrap",
            }}
          >
            Sign Out
          </span>
        )}
      </button>
    </div>
  </aside>

  {/* ======================================================
      SIDEBAR TOGGLE
  ====================================================== */}

  <button
    onClick={onToggle}
    aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
    aria-expanded={isOpen}
    style={{
      position: "fixed",
      top: "calc(50% - 40vh + 20px)",
      left: SIDEBAR_MARGIN + width - 16,
      zIndex: 50,
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: BG,
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow:
        "4px 4px 10px #c5c8ce, -4px -4px 10px #ffffff",
      transition: "left 0.25s ease",
    }}
  >
    {isOpen ? (
      <ChevronsLeft size={16} color="#5b5f66" />
    ) : (
      <ChevronsRight size={16} color="#5b5f66" />
    )}
  </button>
</>

);
}
