"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  LogOut,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";

import {
  getAnalytics,
  getStoredUser,
  logout,
  type Analytics,
  type User,
} from "@/lib/api";

// ============================================================
// DESIGN
// ============================================================

const FONT_DISPLAY =
  '"Lucida Fax", "Lucida Bright", Georgia, serif';

const FONT_NUMBERS =
  '"Rubik", "Gotham", Arial, sans-serif';

const PROFIT_COLOR = "#15803d";
const LOSS_COLOR = "#b91c1c";

const neutralShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.20),-8px_-8px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.25),-10px_-10px_24px_rgba(255,255,255,1)]";

const profitShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.18),-8px_-8px_18px_rgba(255,255,255,0.95),0_4px_16px_rgba(21,128,61,0.12)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.22)]";

const lossShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.18),-8px_-8px_18px_rgba(255,255,255,0.95),0_4px_16px_rgba(185,28,28,0.12)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.22)]";

const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.16),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]";

// ============================================================
// HELPERS
// ============================================================

function formatNumber(
  value: string | number | null | undefined
) {
  const number = Number(value ?? 0);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatInteger(
  value: number | null | undefined
) {
  return Number(value ?? 0).toLocaleString();
}

function formatPercent(
  value: number | null | undefined
) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function isPositive(
  value: string | number | null | undefined
) {
  return Number(value ?? 0) >= 0;
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  icon: Icon,
  positive,
  suffix,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  positive?: boolean;
  suffix?: string;
}) {
  const pnlAware =
    positive === undefined
      ? neutralShadow
      : positive
        ? profitShadow
        : lossShadow;

  return (
    <div
      className={`
        rounded-3xl
        border border-zinc-300/70
        bg-[#eef1f5]
        p-5
        transition-all
        duration-300
        hover:-translate-y-0.5
        ${pnlAware}
        ${
          positive === true
            ? "hover:border-zinc-600/30"
            : positive === false
              ? "hover:border-zinc-600/30"
              : "hover:border-zinc-400/80"
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            {label}
          </p>

          <p
            className={`mt-3 text-2xl font-semibold ${
              positive === true
                ? "text-green-700"
                : positive === false
                  ? "text-red-700"
                  : "text-zinc-900"
            }`}
            style={{ fontFamily: FONT_NUMBERS }}
          >
            {value}

            {suffix && (
              <span className="ml-1 text-sm font-medium">
                {suffix}
              </span>
            )}
          </p>
        </div>

        <div
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-2xl
            border border-zinc-300/70
            bg-[#eef1f5]
            ${insetShadow}
          `}
        >
          <Icon
            size={18}
            className={
              positive === true
                ? "text-green-700"
                : positive === false
                  ? "text-red-700"
                  : "text-zinc-700"
            }
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION CARD
// ============================================================

function SectionCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`
        rounded-3xl
        border border-zinc-300/70
        bg-[#eef1f5]
        p-6
        ${neutralShadow}
        ${className}
      `}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`
            flex h-10 w-10
            items-center justify-center
            rounded-2xl
            border border-zinc-300/70
            bg-[#eef1f5]
            ${insetShadow}
          `}
        >
          <Icon size={18} className="text-zinc-700" />
        </div>

        <h2
          className="text-lg font-semibold text-zinc-900"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

// ============================================================
// INFO ROW
// ============================================================

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-zinc-300/50 py-3 last:border-b-0">
      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span
        className="text-right text-sm font-semibold text-zinc-800"
        style={{
          fontFamily: mono
            ? FONT_NUMBERS
            : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD PROFILE + ANALYTICS
  // ==========================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const storedUser = getStoredUser();

        if (!storedUser) {
          setError(
            "Your session could not be found. Please log in again."
          );
          return;
        }

        setUser(storedUser);

        try {
          const analyticsData =
            await getAnalytics();

          setAnalytics(analyticsData);
        } catch {
          // Profile can still work even if analytics fails.
          setAnalytics(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ==========================================================
  // DERIVED USER DATA
  // ==========================================================

  const fullName = useMemo(() => {
    if (!user) {
      return "";
    }

    const name = [
      user.first_name,
      user.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return name || user.username;
  }, [user]);

  // ==========================================================
  // DERIVED ANALYTICS
  // ==========================================================

  const netPnl = useMemo(() => {
    return Number(analytics?.net_pnl ?? 0);
  }, [analytics]);

  const grossPnl = useMemo(() => {
    return Number(analytics?.gross_pnl ?? 0);
  }, [analytics]);

  const totalFees = useMemo(() => {
    return Number(analytics?.total_fees ?? 0);
  }, [analytics]);

  const bestDay = analytics?.best_trading_day;
  const worstDay = analytics?.worst_trading_day;

  const averageHoldingHours = useMemo(() => {
    const seconds =
      analytics?.average_holding_time
        ?.average_seconds ?? 0;

    return seconds / 3600;
  }, [analytics]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  function handleLogout() {
    logout();

    window.location.href = "/login";
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
          <div
            className={`
              rounded-3xl
              border border-zinc-300/70
              bg-[#eef1f5]
              px-10 py-8
              ${neutralShadow}
            `}
          >
            <p
              className="text-sm font-medium text-zinc-600"
              style={{ fontFamily: FONT_NUMBERS }}
            >
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !user) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
          <div
            className={`
              w-full max-w-md
              rounded-3xl
              border border-red-300/60
              bg-[#eef1f5]
              p-7
              text-center
              ${lossShadow}
            `}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1f5]">
              <ShieldCheck
                size={22}
                className="text-red-700"
              />
            </div>

            <h1
              className="mt-4 text-xl font-semibold text-zinc-900"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Profile unavailable
            </h1>

            <p className="mt-2 whitespace-pre-line text-sm text-zinc-600">
              {error || "Please log in again."}
            </p>

            <Link
              href="/login"
              className="
                mt-6 inline-flex
                items-center justify-center
                rounded-2xl
                border border-zinc-800
                bg-zinc-900
                px-5 py-3
                text-sm font-semibold text-white
                shadow-[7px_7px_16px_rgba(163,177,198,0.28),-5px_-5px_12px_rgba(255,255,255,0.75)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-zinc-600/30
                hover:shadow-[8px_8px_18px_rgba(163,177,198,0.25),-6px_-6px_14px_rgba(255,255,255,0.85),0_6px_22px_rgba(21,128,61,0.28)]
              "
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#eef1f5] px-4 py-7 sm:px-6 lg:px-8 tracking-widest font-sans">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <Link
                href="/dashboard"
                className="
                  mb-4 inline-flex
                  items-center gap-2
                  text-sm font-medium
                  text-zinc-500
                  transition-colors
                  hover:text-green-700
                "
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>

              <h1
                className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
                style={{ fontFamily: FONT_DISPLAY }}
              >
               HELLO,  {fullName}
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Your Trading Edge account and trading performance overview.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                self-start
                rounded-2xl
                border border-zinc-300/70
                bg-[#eef1f5]
                px-5 py-3
                text-sm font-semibold
                text-zinc-700
                transition-all duration-300
                hover:border-zinc-600/70
                hover:text-red-700
                hover:shadow-[7px_7px_18px_rgba(163,177,198,0.22),-7px_-7px_18px_rgba(255,255,255,0.95),0_6px_22px_rgba(185,28,28,0.22)]
              "
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        {/* ==================================================
            PROFILE HERO
        ================================================== */}

        <section
          className={`
            mb-7
            overflow-hidden
            rounded-[2rem]
            border border-zinc-300/70
            bg-[#eef1f5]
            p-6 sm:p-8
            ${neutralShadow}
          `}
        >
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">

              {/* Avatar */}

              <div
                className="
                  flex h-20 w-20 shrink-0
                  items-center justify-center
                  rounded-[1.7rem]
                  border border-zinc-300/70
                  bg-[#eef1f5]
                  shadow-[inset_6px_6px_14px_rgba(163,177,198,0.18),inset_-6px_-6px_14px_rgba(255,255,255,0.95)]
                "
              >
                <UserRound
                  size={34}
                  strokeWidth={1.7}
                  className="text-zinc-700"
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Trading Edge Trader
                </p>

                {/* Full Name */}

                <h2
                  className="mt-1 text-2xl font-semibold text-zinc-900 sm:text-3xl"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  {fullName}
                </h2>

                {/* Username */}

                <p
                  className="mt-1 text-sm text-zinc-500"
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  @{user.username}
                </p>

                {/* Account ID */}

                <p
                  className="mt-1 text-xs text-zinc-400"
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  Account #{user.id}
                </p>
              </div>
            </div>

            {/* Net P&L */}

            <div
              className={`
                min-w-[220px]
                rounded-3xl
                border border-zinc-300/70
                bg-[#eef1f5]
                p-5
                transition-all duration-300
                ${
                  isPositive(netPnl)
                    ? `${profitShadow} hover:border-zinc-600/30`
                    : `${lossShadow} hover:border-zinc-600/30`
                }
              `}
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Net P&L
              </p>

              <div className="mt-2 flex items-center gap-2">
                {netPnl >= 0 ? (
                  <TrendingUp
                    size={21}
                    className="text-green-700"
                  />
                ) : (
                  <TrendingDown
                    size={21}
                    className="text-red-700"
                  />
                )}

                <span
                  className={`text-3xl font-semibold ${
                    netPnl >= 0
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  {netPnl >= 0 ? "+" : ""}
                  {formatNumber(netPnl)}
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-500">
                Overall trading result
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            QUICK STATS
        ================================================== */}

        {analytics && (
          <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">

            <StatCard
              label="Total Trades"
              value={formatInteger(
                analytics.total_trades
              )}
              icon={BarChart3}
            />

            <StatCard
              label="Win Rate"
              value={formatPercent(
                analytics.win_rate
              )}
              icon={Target}
              positive={
                analytics.win_rate >= 50
              }
            />

            <StatCard
              label="Gross P&L"
              value={`${
                grossPnl >= 0 ? "+" : ""
              }${formatNumber(grossPnl)}`}
              icon={
                grossPnl >= 0
                  ? TrendingUp
                  : TrendingDown
              }
              positive={grossPnl >= 0}
            />

            <StatCard
              label="Total Fees"
              value={formatNumber(totalFees)}
              icon={Wallet}
            />
          </div>
        )}

        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ==================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <SectionCard
            title="Account Information"
            icon={UserRound}
          >
            <div>

              <InfoRow
                label="Full Name"
                value={fullName}
              />

              <InfoRow
                label="First Name"
                value={
                  user.first_name || "Not provided"
                }
              />

              <InfoRow
                label="Last Name"
                value={
                  user.last_name || "Not provided"
                }
              />

              <InfoRow
                label="Username"
                value={`@${user.username}`}
              />

              <InfoRow
                label="User ID"
                value={`#${user.id}`}
                mono
              />

              <InfoRow
                label="Account Type"
                value="Trading Account"
              />

              <InfoRow
                label="Platform"
                value="Trading Edge"
              />
            </div>
          </SectionCard>

          {/* ==================================================
              PERFORMANCE SUMMARY
          ================================================== */}

          <SectionCard
            title="Performance Summary"
            icon={BarChart3}
          >
            {analytics ? (
              <div>

                <InfoRow
                  label="Winning Trades"
                  value={formatInteger(
                    analytics.winning_trades
                  )}
                />

                <InfoRow
                  label="Losing Trades"
                  value={formatInteger(
                    analytics.losing_trades
                  )}
                />

                <InfoRow
                  label="Breakeven Trades"
                  value={formatInteger(
                    analytics.breakeven_trades
                  )}
                />

                <InfoRow
                  label="Profit Factor"
                  value={
                    analytics.profit_factor
                      ? formatNumber(
                          analytics.profit_factor
                        )
                      : "N/A"
                  }
                  mono
                />
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Performance data is currently unavailable.
              </p>
            )}
          </SectionCard>

          {/* ==================================================
              PROFIT & LOSS
          ================================================== */}

          <SectionCard
            title="Profit & Loss"
            icon={Wallet}
          >
            {analytics ? (
              <div className="grid grid-cols-2 gap-4">

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${
                      Number(analytics.gross_profit) >= 0
                        ? `${profitShadow} hover:border-zinc-600/30`
                        : neutralShadow
                    }
                  `}
                >
                  <p className="text-xs text-zinc-500">
                    Gross Profit
                  </p>

                  <p
                    className="mt-2 text-lg font-semibold text-green-700"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    +
                    {formatNumber(
                      analytics.gross_profit
                    )}
                  </p>
                </div>

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${lossShadow}
                    hover:border-zinc-600/30
                  `}
                >
                  <p className="text-xs text-zinc-500">
                    Gross Loss
                  </p>

                  <p
                    className="mt-2 text-lg font-semibold text-red-700"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    {formatNumber(
                      analytics.gross_loss
                    )}
                  </p>
                </div>

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${
                      Number(
                        analytics.average_win
                      ) >= 0
                        ? `${profitShadow} hover:border-zinc-600/30`
                        : neutralShadow
                    }
                  `}
                >
                  <p className="text-xs text-zinc-500">
                    Average Win
                  </p>

                  <p
                    className="mt-2 text-lg font-semibold text-green-700"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    +
                    {formatNumber(
                      analytics.average_win
                    )}
                  </p>
                </div>

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${lossShadow}
                    hover:border-zinc-600/30
                  `}
                >
                  <p className="text-xs text-zinc-500">
                    Average Loss
                  </p>

                  <p
                    className="mt-2 text-lg font-semibold text-red-700"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    {formatNumber(
                      analytics.average_loss
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                P&L data is currently unavailable.
              </p>
            )}
          </SectionCard>

          {/* ==================================================
              TRADING HABITS
          ================================================== */}

          <SectionCard
            title="Trading Habits"
            icon={CalendarDays}
          >
            {analytics ? (
              <div>

                <InfoRow
                  label="Trading Days"
                  value={formatInteger(
                    analytics.trade_frequency
                      .trading_days
                  )}
                />

                <InfoRow
                  label="Trades / Day"
                  value={formatNumber(
                    analytics.trade_frequency
                      .average_trades_per_day
                  )}
                  mono
                />

                <InfoRow
                  label="Trades / Week"
                  value={formatNumber(
                    analytics.trade_frequency
                      .trades_per_week
                  )}
                  mono
                />

                <InfoRow
                  label="Trades / Month"
                  value={formatNumber(
                    analytics.trade_frequency
                      .trades_per_month
                  )}
                  mono
                />

                <InfoRow
                  label="Avg. Holding Time"
                  value={
                    averageHoldingHours < 1
                      ? `${(
                          averageHoldingHours * 60
                        ).toFixed(0)} min`
                      : `${averageHoldingHours.toFixed(
                          1
                        )} hrs`
                  }
                  mono
                />
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Trading habit data is currently unavailable.
              </p>
            )}
          </SectionCard>
        </div>

        {/* ==================================================
            BEST / WORST DAY
        ================================================== */}

        {analytics && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* Best Day */}

            <div
              className={`
                rounded-3xl
                border border-zinc-300/70
                bg-[#eef1f5]
                p-6
                ${profitShadow}
                hover:border-zinc-600/30
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                    Best Trading Day
                  </p>

                  <h3
                    className="mt-2 text-xl font-semibold text-zinc-900"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {bestDay
                      ? new Date(
                          bestDay.date
                        ).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "No data yet"}
                  </h3>
                </div>

                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                  "
                >
                  <TrendingUp
                    size={20}
                    className="text-green-700"
                  />
                </div>
              </div>

              <p
                className="mt-4 text-2xl font-semibold text-green-700"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                {bestDay
                  ? `+${formatNumber(
                      bestDay.pnl
                    )}`
                  : "—"}
              </p>
            </div>

            {/* Worst Day */}

            <div
              className={`
                rounded-3xl
                border border-zinc-300/70
                bg-[#eef1f5]
                p-6
                ${lossShadow}
                hover:border-zinc-600/30
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                    Worst Trading Day
                  </p>

                  <h3
                    className="mt-2 text-xl font-semibold text-zinc-900"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    {worstDay
                      ? new Date(
                          worstDay.date
                        ).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "No data yet"}
                  </h3>
                </div>

                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                  "
                >
                  <TrendingDown
                    size={20}
                    className="text-red-700"
                  />
                </div>
              </div>

              <p
                className="mt-4 text-2xl font-semibold text-red-700"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                {worstDay
                  ? formatNumber(
                      worstDay.pnl
                    )
                  : "—"}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            STREAKS
        ================================================== */}

        {analytics && (
          <section className="mt-6">
            <div
              className={`
                rounded-3xl
                border border-zinc-300/70
                bg-[#eef1f5]
                p-6
                ${neutralShadow}
              `}
            >
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={`
                    flex h-10 w-10
                    items-center justify-center
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    ${insetShadow}
                  `}
                >
                  <Target
                    size={18}
                    className="text-zinc-700"
                  />
                </div>

                <h2
                  className="text-lg font-semibold text-zinc-900"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  Trading Streaks
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-5
                    ${profitShadow}
                    hover:border-zinc-600/30
                  `}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                    Winning Streak
                  </p>

                  <p
                    className="mt-2 text-3xl font-semibold text-green-700"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    {analytics.winning_streak}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    consecutive wins
                  </p>
                </div>

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-5
                    ${lossShadow}
                    hover:border-zinc-600/30
                  `}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                    Losing Streak
                  </p>

                  <p
                    className="mt-2 text-3xl font-semibold text-red-700"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    {analytics.losing_streak}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    consecutive losses
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div className="mt-7 grid gap-4 sm:grid-cols-2">

          <Link
            href="/dashboard"
            className="
              flex items-center justify-center gap-2
              rounded-2xl
              border border-zinc-300/70
              bg-[#eef1f5]
              px-5 py-4
              text-sm font-semibold
              text-zinc-700
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-green-600/70
              hover:text-green-700
              hover:shadow-[8px_8px_20px_rgba(163,177,198,0.23),-8px_-8px_20px_rgba(255,255,255,0.95),0_6px_24px_rgba(21,128,61,0.20)]
            "
          >
            <BarChart3 size={17} />
            Go to Dashboard
          </Link>

          <Link
            href="/trades"
            className="
              flex items-center justify-center gap-2
              rounded-2xl
              border border-zinc-300/70
              bg-[#eef1f5]
              px-5 py-4
              text-sm font-semibold
              text-zinc-700
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-green-600/70
              hover:text-green-700
              hover:shadow-[8px_8px_20px_rgba(163,177,198,0.23),-8px_-8px_20px_rgba(255,255,255,0.95),0_6px_24px_rgba(21,128,61,0.20)]
            "
          >
            <BarChart3 size={17} />
            View My Trades
          </Link>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="py-8 text-center">
          <p className="text-xs text-zinc-400">
            Trading Edge · Trade with discipline. Learn from every trade.
          </p>
        </div>
      </div>
    </main>
  );
}
