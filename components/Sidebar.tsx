"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ChartCandlestick,
  ChartNoAxesCombined,
  SquarePlus,
  UserStar,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  BookOpenCheck,
  Route,
  BrainCircuit,
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
// NEUMORPHIC SHADOWS
// ============================================================

const raisedShadow =
  "7px 7px 15px rgba(175, 181, 191, 0.58), -7px -7px 15px rgba(255, 255, 255, 0.92)";

const raisedShadowHover =
  "9px 9px 19px rgba(175, 181, 191, 0.62), -9px -9px 19px rgba(255, 255, 255, 0.96)";

const insetShadow =
  "inset 4px 4px 9px rgba(175, 181, 191, 0.48), inset -4px -4px 9px rgba(255, 255, 255, 0.92)";

const smallRaisedShadow =
  "4px 4px 9px rgba(175, 181, 191, 0.52), -4px -4px 9px rgba(255, 255, 255, 0.94)";

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
    label: "Analytics",
    icon: ChartNoAxesCombined,
    href: "/analytics",
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
    label: "Trading Journey",
    icon: Route,
    href: "/journey",
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

          background: BG,

          borderRadius: 20,

          padding: "24px 16px",

          boxSizing: "border-box",

          boxShadow:
            "10px 10px 24px rgba(197, 200, 206, 0.78), -10px -10px 24px rgba(255, 255, 255, 0.96)",

          transition:
            "width 0.25s ease, box-shadow 0.25s ease",

          zIndex: 40,

          display: "flex",
          flexDirection: "column",

          alignItems: isOpen
            ? "stretch"
            : "center",

          gap: 14,

          /*
           * Important:
           * Do not clip the neumorphic shadows.
           */
          overflow: "visible",
        }}
      >
        {/* ====================================================
            LOGO
        ==================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",

            justifyContent: isOpen
              ? "flex-start"
              : "center",

            gap: 10,

            padding: isOpen
              ? "0 8px 10px"
              : "0 0 10px",

            flexShrink: 0,

            boxSizing: "border-box",
          }}
        >
          <Link
            href="/"
            style={{
              width: 50,
              height: 50,

              flexShrink: 0,

              borderRadius: 12,

              background: BG,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontWeight: 700,
              fontSize: 15,

              color: "#4a4e55",

              boxSizing: "border-box",

              boxShadow: smallRaisedShadow,

              transition:
                "box-shadow 0.2s ease, transform 0.2s ease",
            }}
          >
            MD
          </Link>

          {isOpen && (
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,

                color: "#4a4e55",

                whiteSpace: "nowrap",

                letterSpacing: "-0.01em",
              }}
            >
              The Millionaire Diary
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

            gap: 15,

            width: "100%",

            /*
             * No scroll container here.
             * This prevents button shadows from being clipped
             * into rectangular shapes.
             */
            overflow: "visible",

            padding: 4,

            boxSizing: "border-box",
          }}
        >
          {NAV_ITEMS.map(
            ({ label, icon: Icon, href }) => {
              const isActive =
                isRouteActive(href);

              return (
                <Link
                  key={label}
                  href={href}
                  title={
                    isOpen
                      ? undefined
                      : label
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",

                    justifyContent: isOpen
                      ? "flex-start"
                      : "center",

                    gap: 12,

                    width: isOpen
                      ? "100%"
                      : 48,

                    height: 48,

                    /*
                     * Important:
                     * border-box prevents width + padding
                     * from extending outside the container.
                     */
                    boxSizing: "border-box",

                    padding: isOpen
                      ? "0 16px"
                      : "5px",

                    borderRadius: 12,

                    background: BG,

                    color: isActive
                      ? "#3f7d58"
                      : "#4a4e55",

                    fontSize: 13,

                    fontWeight: 500,

                    textDecoration: "none",

                    flexShrink: 0,

                    boxShadow: isActive
                      ? insetShadow
                      : raisedShadow,

                    transition:
                      "box-shadow 0.2s ease, transform 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.boxShadow =
                        raisedShadowHover;

                      e.currentTarget.style.transform =
                        "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.boxShadow =
                        raisedShadow;

                      e.currentTarget.style.transform =
                        "translateY(0)";
                    }
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
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
            }
          )}
        </nav>

        {/* ====================================================
            SIGN OUT
        ==================================================== */}

        <div
          style={{
            marginTop: "auto",

            width: isOpen
              ? "100%"
              : "auto",

            padding: "8px 4px 0",

            boxSizing: "border-box",
          }}
        >
          <button
            onClick={handleSignOut}
            title={
              isOpen
                ? undefined
                : "Sign Out"
            }
            style={{
              width: isOpen
                ? "100%"
                : 48,

              height: 48,

              display: "flex",
              alignItems: "center",

              justifyContent: isOpen
                ? "flex-start"
                : "center",

              gap: 12,

              padding: isOpen
                ? "0 16px"
                : "5px",

              boxSizing: "border-box",

              border: "none",

              borderRadius: 12,

              background: BG,

              color: "#b23b3b",

              fontSize: 13,

              fontWeight: 500,

              cursor: "pointer",

              boxShadow: raisedShadow,

              transition:
                "box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                raisedShadowHover;

              e.currentTarget.style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                raisedShadow;

              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
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
        aria-label={
          isOpen
            ? "Hide sidebar"
            : "Show sidebar"
        }
        aria-expanded={isOpen}
        style={{
          position: "fixed",

          top: "calc(50% - 40vh + 20px)",

          left:
            SIDEBAR_MARGIN +
            width -
            16,

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

          boxSizing: "border-box",

          boxShadow:
            "4px 4px 10px rgba(197, 200, 206, 0.78), -4px -4px 10px rgba(255, 255, 255, 0.96)",

          transition:
            "left 0.25s ease, box-shadow 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "5px 5px 12px rgba(197, 200, 206, 0.82), -5px -5px 12px rgba(255, 255, 255, 1)";

          e.currentTarget.style.transform =
            "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "4px 4px 10px rgba(197, 200, 206, 0.78), -4px -4px 10px rgba(255, 255, 255, 0.96)";

          e.currentTarget.style.transform =
            "scale(1)";
        }}
      >
        {isOpen ? (
          <ChevronsLeft
            size={16}
            strokeWidth={1.8}
            color="#5b5f66"
          />
        ) : (
          <ChevronsRight
            size={16}
            strokeWidth={1.8}
            color="#5b5f66"
          />
        )}
      </button>
    </>
  );
}