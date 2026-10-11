"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ChartCandlestick,
  SquarePlus,
  UserStar,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  BookOpenCheck,
  BrainCircuit,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

// ============================================================
// DESIGN
// ============================================================

const BG = "#151326";

export const SIDEBAR_WIDTH_OPEN = 260;
export const SIDEBAR_WIDTH_CLOSED = 88;

const SIDEBAR_MARGIN = 20;

// ============================================================
// NEUMORPHIC SHADOWS
// ============================================================

const raisedShadow =
  "-7px -7px 18px rgba(139, 92, 246, 0.08), 8px 8px 18px rgba(0, 0, 0, 0.48), inset 0 0 0 1px rgba(167, 139, 250, 0.12)";

const raisedShadowHover =
  "-5px -5px 18px rgba(139, 92, 246, 0.18), 8px 8px 20px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(196, 181, 253, 0.42), inset 0 0 12px rgba(139, 92, 246, 0.10)";

const insetShadow =
  "inset 4px 4px 10px rgba(0, 0, 0, 0.48), inset -3px -3px 10px rgba(139, 92, 246, 0.10), inset 0 0 0 1px rgba(167, 139, 250, 0.42), inset 0 0 14px rgba(139, 92, 246, 0.12)";

// ============================================================
// BRAND GRADIENT
// ============================================================

const BRAND_GRADIENT =
  "linear-gradient(110deg, #e9d5ff 0%, #c084fc 45%, #e879f9 100%)";

// ============================================================
// NAVIGATION
// ============================================================

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Trades",
    icon: ChartCandlestick,
    href: "/trades",
  },
  {
    label: "Add Trade",
    icon: SquarePlus,
    href: "/trades/new",
  },
  {
    label: "Trading Rules",
    icon: BookOpenCheck,
    href: "/rules",
  },
  {
    label: "Smart Money Concepts",
    icon: BrainCircuit,
    href: "/smc",
  },
  {
    label: "User Profile",
    icon: UserStar,
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

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
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
          left: SIDEBAR_MARGIN,
          transform: "translateY(-50%)",

          width,
          height: "95vh",
          maxHeight: "95vh",
          minHeight: 0,

          background: BG,
          border: "1px solid rgba(167, 139, 250, 0.72)",
          borderRadius: 20,

          padding: "24px 16px",

          boxSizing: "border-box",

          boxShadow:
            "12px 12px 30px rgba(0, 0, 0, 0.58), -8px -8px 24px rgba(139, 92, 246, 0.08), inset 0 0 24px rgba(139, 92, 246, 0.045)",

          // Faster sidebar expansion and collapse
          transition:
            "width 0.12s ease, box-shadow 0.2s ease",

          zIndex: 40,

          display: "flex",
          flexDirection: "column",

          alignItems: isOpen ? "stretch" : "center",
          gap: 14,

          overflow: "visible",
        }}
      >
        {/* ====================================================
            LOGO AND BRAND NAME
        ==================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "flex-start" : "center",
            gap: 10,

            padding: isOpen ? "0 8px 10px" : "0 0 10px",

            flexShrink: 0,
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {/* MD LOGO — LINKS TO HOME */}

          <Link
            href="/"
            aria-label="The Millionaire Diary home"
            style={{
              width: 50,
              height: 50,
              flexShrink: 0,

              borderRadius: 12,

              background:
                "linear-gradient(145deg, #21183f 0%, #151326 72%)",

              border: "1px solid rgba(196, 181, 253, 0.95)",

              textDecoration: "none",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.08em",

              boxSizing: "border-box",

              boxShadow:
                "0 0 16px rgba(139, 92, 246, 0.24), inset 0 0 0 1px rgba(196, 181, 253, 0.12), 4px 4px 10px rgba(0, 0, 0, 0.45)",

              transition:
                "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(232, 121, 249, 0.95)";

              e.currentTarget.style.boxShadow =
                "0 0 22px rgba(192, 132, 252, 0.36), 4px 4px 12px rgba(0, 0, 0, 0.45)";

              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(196, 181, 253, 0.95)";

              e.currentTarget.style.boxShadow =
                "0 0 16px rgba(139, 92, 246, 0.24), inset 0 0 0 1px rgba(196, 181, 253, 0.12), 4px 4px 10px rgba(0, 0, 0, 0.45)";

              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span
              style={{
                background: BRAND_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MD
            </span>
          </Link>

          {/* BRAND NAME — ALSO LINKS TO HOME */}

          {isOpen && (
            <Link
              href="/"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), sans-serif",

                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.025em",

                whiteSpace: "nowrap",
                textDecoration: "none",

                background: BRAND_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",

                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              The Millionaire Diary
            </Link>
          )}
        </div>

        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,

            width: "100%",

            overflow: "visible",
            padding: 4,

            boxSizing: "border-box",
          }}
        >
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive = isRouteActive(href);

            return (
              <Link
                key={label}
                href={href}
                title={isOpen ? undefined : label}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",

                  justifyContent: isOpen
                    ? "flex-start"
                    : "center",

                  gap: 12,

                  width: isOpen ? "100%" : 48,
                  height: 48,

                  boxSizing: "border-box",

                  padding: isOpen ? "0 16px" : "5px",

                  borderRadius: 12,

                  background: isActive
                    ? "linear-gradient(110deg, rgba(139, 92, 246, 0.22), rgba(21, 19, 38, 0.98))"
                    : BG,

                  border: isActive
                    ? "1px solid rgba(196, 181, 253, 0.95)"
                    : "1px solid rgba(167, 139, 250, 0.52)",

                  letterSpacing: "0.035em",

                  color: isActive ? "#e9d5ff" : "#c4b5fd",

                  fontSize: 13,
                  fontWeight: 500,

                  textDecoration: "none",
                  flexShrink: 0,

                  boxShadow: isActive
                    ? insetShadow
                    : raisedShadow,

                  transition:
                    "box-shadow 0.2s ease, transform 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.boxShadow =
                      raisedShadowHover;

                    e.currentTarget.style.transform =
                      "translateY(-1px)";

                    e.currentTarget.style.borderColor =
                      "rgba(196, 181, 253, 0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.boxShadow =
                      raisedShadow;

                    e.currentTarget.style.transform =
                      "translateY(0)";

                    e.currentTarget.style.borderColor =
                      "rgba(167, 139, 250, 0.52)";
                  }
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  style={{ flexShrink: 0 }}
                />

                {isOpen && (
                  <span style={{ whiteSpace: "nowrap" }}>
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

            padding: "8px 4px 0",

            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={handleSignOut}
            title={isOpen ? undefined : "Sign Out"}
            style={{
              width: isOpen ? "100%" : 48,
              height: 48,

              display: "flex",
              alignItems: "center",

              justifyContent: isOpen
                ? "flex-start"
                : "center",

              gap: 12,

              padding: isOpen ? "0 16px" : "5px",

              boxSizing: "border-box",

              borderRadius: 12,

              background:
                "linear-gradient(110deg, rgba(251, 113, 133, 0.08), #151326 72%)",

              border: "1px solid rgba(251, 113, 133, 0.68)",

              letterSpacing: "0.045em",
              color: "#fb7185",

              fontSize: 13,
              fontWeight: 500,

              cursor: "pointer",

              boxShadow: raisedShadow,

              transition:
                "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 18px rgba(251, 113, 133, 0.15), 5px 5px 14px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(251, 113, 133, 0.25)";

              e.currentTarget.style.transform = "translateY(-1px)";

              e.currentTarget.style.borderColor =
                "rgba(251, 113, 133, 0.95)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = raisedShadow;

              e.currentTarget.style.transform = "translateY(0)";

              e.currentTarget.style.borderColor =
                "rgba(251, 113, 133, 0.68)";
            }}
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
              style={{ flexShrink: 0 }}
            />

            {isOpen && (
              <span style={{ whiteSpace: "nowrap" }}>
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
        type="button"
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

          background: "#1b1633",
          border: "1px solid rgba(196, 181, 253, 0.9)",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          cursor: "pointer",
          boxSizing: "border-box",

          boxShadow:
            "4px 4px 12px rgba(0, 0, 0, 0.50), -3px -3px 10px rgba(139, 92, 246, 0.12), inset 0 0 0 1px rgba(167, 139, 250, 0.20)",

          // Faster toggle movement
          transition:
            "left 0.12s ease, box-shadow 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 22px rgba(167, 139, 250, 0.48), 5px 5px 14px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(233, 213, 255, 0.88)";

          e.currentTarget.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 15px rgba(139, 92, 246, 0.24), 4px 4px 12px rgba(0, 0, 0, 0.50), inset 0 0 0 1px rgba(221, 214, 254, 0.22)";

          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isOpen ? (
          <ChevronsLeft
            size={16}
            strokeWidth={1.8}
            color="#c4b5fd"
          />
        ) : (
          <ChevronsRight
            size={16}
            strokeWidth={1.8}
            color="#c4b5fd"
          />
        )}
      </button>
    </>
  );
}
