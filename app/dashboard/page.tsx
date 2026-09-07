"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  Gauge,
} from "lucide-react";

import {
  getStoredUser,
  getTrades,
  getAnalytics, 
  type Trade,
  type Analytics,
} from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Fonts                                                                      */
/* -------------------------------------------------------------------------- */

const FONT_DISPLAY = '"Lucida Fax", "Lucida Bright", Georgia, serif';
const FONT_NUMBERS = '"Rubik", "Gotham", Arial, sans-serif';

const displayFontStyle = {
  fontFamily: FONT_DISPLAY,
  letterSpacing: "0.04em",
} as const;

const numberFontStyle = {
  fontFamily: FONT_NUMBERS,
  letterSpacing: "0.04em",
} as const;

/* -------------------------------------------------------------------------- */
/* Colors                                                                     */
/* -------------------------------------------------------------------------- */

const PROFIT_COLOR = "#15803d";
const PROFIT_BRIGHT = "#22c55e";

const LOSS_COLOR = "#b91c1c";
const LOSS_BRIGHT = "#ef4444";

const SURFACE = "#eef1f5";

/* -------------------------------------------------------------------------- */
/* Shadows                                                                    */
/* -------------------------------------------------------------------------- */

/*
 * Base neumorphic shadow.
 *
 * IMPORTANT:
 * P&L cards remain completely neutral at rest.
 * Green/red glow is introduced only through hover shadows.
 */

const neutralShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_25px_rgba(163,177,198,0.30),-10px_-10px_25px_rgba(255,255,255,1)]";

/*
 * P&L shadow:
 * neutral at rest
 * P&L colored glow ONLY on hover
 */

const profitShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_26px_rgba(163,177,198,0.26),-10px_-10px_26px_rgba(255,255,255,1)]";

const lossShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_26px_rgba(163,177,198,0.26),-10px_-10px_26px_rgba(255,255,255,1)]";

/*
 * Inset neumorphism.
 */

const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.18),inset_-5px_-5px_12px_rgba(255,255,255,0.90)]";

/* -------------------------------------------------------------------------- */
/* Reusable P&L helpers                                                       */
/* -------------------------------------------------------------------------- */

function pnlHoverBorder(positive: boolean): string {
  return positive
    ? "border-zinc-300/70 hover:border-green-300/30"
    : "border-zinc-300/70 hover:border-red-300/30";
}

function pnlShadow(positive: boolean): string {
  return positive ? profitShadow : lossShadow;
}

function pnlTextColor(positive: boolean): string {
  return positive ? PROFIT_COLOR : LOSS_COLOR;
}

function pnlIconColor(positive: boolean): string {
  return positive ? "text-green-700" : "text-red-700";
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getNetPnl(trade: Trade): number {
  return toNum(trade.pnl) - toNum(trade.fees);
}

function fmtMoney(value: number): string {
  const abs = Math.abs(value);

  return `$${abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtSignedMoney(value: number): string {
  return `${value >= 0 ? "+" : "-"}${fmtMoney(value)}`;
}

function fmtPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function fmtDate(value: unknown): string {
  if (!value) return "—";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function monthKey(value: unknown): string {
  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`;
}

function monthYearLabel(key: string): string {
  if (key === "unknown") return "Unknown Date";

  const [year, month] = key.split("-").map(Number);

  if (!year || !month) return "Unknown Date";

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function shortMonthLabel(key: string): string {
  if (key === "unknown") return "Unknown";

  const [year, month] = key.split("-").map(Number);

  if (!year || !month) return "Unknown";

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function dayKey(value: unknown): string {
  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthDate(key: string): Date | null {
  if (key === "unknown") return null;

  const [year, month] = key.split("-").map(Number);

  if (!year || !month) return null;

  return new Date(year, month - 1, 1);
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  subtitle,
  icon,
  positive,
  valueColor,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  positive?: boolean;
  valueColor?: string;
}) {
  const isPnlCard = positive !== undefined;

  const shadow = isPnlCard
    ? pnlShadow(positive)
    : neutralShadow;

  return (
    <div
      className={[
        "group w-full rounded-[18px] border bg-[#eef1f5] p-3.5",
        "transition-all duration-300 hover:-translate-y-1",
        isPnlCard
          ? pnlHoverBorder(positive)
          : "border-zinc-300/70",
        shadow,
      ].join(" ")}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p
            className="text-[9px] uppercase tracking-[0.14em] text-zinc-400"
            style={numberFontStyle}
          >
            {label}
          </p>
        </div>

        <div
          className={[
            "flex h-8 w-8 items-center justify-center rounded-xl",
            "bg-[#eef1f5]",
            positive === true
              ? "text-green-700"
              : positive === false
                ? "text-red-700"
                : "text-zinc-500",
            insetShadow,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <div
        className="text-[20px] font-medium tracking-tight sm:text-[22px]"
        style={{
          ...numberFontStyle,
          color: valueColor || "#18181b",
        }}
      >
        {value}
      </div>

      <p
        className="mt-1 text-[9px] text-zinc-400"
        style={numberFontStyle}
      >
        {subtitle}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Calendar Day                                                               */
/* -------------------------------------------------------------------------- */

function CalendarDay({
  day,
  pnl,
  trades,
  isToday,
}: {
  day: number | null;
  pnl: number;
  trades: number;
  isToday: boolean;
}) {
  if (!day) {
    return <div className="min-h-[74px]" />;
  }

  const hasTrades = trades > 0;
  const positive = pnl >= 0;

  return (
    <div
      className={[
        "group relative min-h-[74px] rounded-xl border bg-[#eef1f5] p-2",
        hasTrades
          ? pnlHoverBorder(positive)
          : "border-zinc-300/60",
        "transition-all duration-300 hover:-translate-y-[2px]",
        hasTrades
          ? pnlShadow(positive)
          : neutralShadow,
        isToday ? "ring-1 ring-zinc-300" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={[
            "flex h-6 w-6 items-center justify-center rounded-lg",
            "text-[10px]",
            isToday
              ? "bg-zinc-900 text-white shadow-md"
              : "text-zinc-500",
          ].join(" ")}
          style={numberFontStyle}
        >
          {day}
        </span>

        {hasTrades && (
          <span
            className="text-[8px] text-zinc-400"
            style={numberFontStyle}
          >
            {trades}T
          </span>
        )}
      </div>

      {hasTrades ? (
        <div
          className="mt-3 truncate text-[11px]"
          style={{
            ...numberFontStyle,
            color: pnlTextColor(positive),
          }}
        >
          {fmtSignedMoney(pnl)}
        </div>
      ) : (
        <div
          className="mt-3 text-[8px] uppercase tracking-[0.08em] text-zinc-300"
          style={numberFontStyle}
        >
          —
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const [firstName, setFirstName] = useState("Trader");
  const [lastName, setLastName] = useState("Trader");

  const [selectedMonth, setSelectedMonth] =
    useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Load User                                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const user = getStoredUser();

    if (user?.first_name) {
      setFirstName(user.first_name);
    }
    if (user?.last_name) {
      setLastName(user.last_name);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Load Dashboard                                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const tradesResult = await getTrades();

        if (!cancelled) {
          setTrades(tradesResult ?? []);
        }

        try {
          const analyticsResult =
            await getAnalytics();

          if (!cancelled) {
            setAnalytics(
              analyticsResult ?? null,
            );
          }
        } catch {
          if (!cancelled) {
            setAnalytics(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard data.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Closed Trades                                                            */
  /* ------------------------------------------------------------------------ */

  const closedTrades = useMemo(() => {
    return trades.filter(
      (trade) =>
        trade.exit_time !== null &&
        trade.exit_time !== undefined &&
        trade.exit_price !== null &&
        trade.exit_price !== undefined,
    );
  }, [trades]);

  /* ------------------------------------------------------------------------ */
  /* Analytics                                                                 */
  /* ------------------------------------------------------------------------ */

  const metrics = useMemo(() => {
    const totalTrades = closedTrades.length;

    let totalPnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    const profits: Trade[] = [];
    const losses: Trade[] = [];

    let bestTrade: Trade | null = null;
    let worstTrade: Trade | null = null;

    for (const trade of closedTrades) {
      const pnl = getNetPnl(trade);

      totalPnl += pnl;

      if (pnl > 0) {
        grossProfit += pnl;
        profits.push(trade);
      } else if (pnl < 0) {
        grossLoss += Math.abs(pnl);
        losses.push(trade);
      }

      if (
        !bestTrade ||
        pnl > getNetPnl(bestTrade)
      ) {
        bestTrade = trade;
      }

      if (
        !worstTrade ||
        pnl < getNetPnl(worstTrade)
      ) {
        worstTrade = trade;
      }
    }

    const winRate =
      totalTrades > 0
        ? (profits.length / totalTrades) * 100
        : 0;

    const calculatedProfitFactor =
      grossLoss > 0
        ? grossProfit / grossLoss
        : grossProfit > 0
          ? grossProfit
          : 0;

    const backendProfitFactor =
      analytics?.profit_factor !== null &&
      analytics?.profit_factor !== undefined
        ? toNum(analytics.profit_factor)
        : null;

    const profitFactor =
      backendProfitFactor !== null
        ? backendProfitFactor
        : calculatedProfitFactor;

    const averageTrade =
      totalTrades > 0
        ? totalPnl / totalTrades
        : 0;

    const averageWin =
      profits.length > 0
        ? grossProfit / profits.length
        : 0;

    const averageLoss =
      losses.length > 0
        ? grossLoss / losses.length
        : 0;

    return {
      totalTrades,
      profits,
      losses,
      totalPnl,
      grossProfit,
      grossLoss,
      winRate,
      profitFactor,
      averageTrade,
      averageWin,
      averageLoss,
      bestTrade,
      worstTrade,
    };
  }, [closedTrades, analytics]);

  /* ------------------------------------------------------------------------ */
  /* Group Trades by Month                                                    */
  /* ------------------------------------------------------------------------ */

  const groupedTrades = useMemo(() => {
    const groups: Record<string, Trade[]> = {};

    for (const trade of closedTrades) {
      const key = monthKey(trade.exit_time);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(trade);
    }

    return groups;
  }, [closedTrades]);

  const monthKeys = useMemo(() => {
    return Object.keys(groupedTrades)
      .filter((key) => key !== "unknown")
      .sort((a, b) => b.localeCompare(a));
  }, [groupedTrades]);

  useEffect(() => {
    if (
      !selectedMonth &&
      monthKeys.length > 0
    ) {
      setSelectedMonth(monthKeys[0]);
    }

    if (
      selectedMonth &&
      monthKeys.length > 0 &&
      !monthKeys.includes(selectedMonth)
    ) {
      setSelectedMonth(monthKeys[0]);
    }
  }, [monthKeys, selectedMonth]);

  const currentMonthTrades = useMemo(() => {
    if (!selectedMonth) return [];

    return groupedTrades[selectedMonth] ?? [];
  }, [groupedTrades, selectedMonth]);

  /* ------------------------------------------------------------------------ */
  /* Current Month Stats                                                      */
  /* ------------------------------------------------------------------------ */

  const currentMonthStats = useMemo(() => {
    let pnl = 0;
    let wins = 0;
    let losses = 0;

    for (const trade of currentMonthTrades) {
      const tradePnl = getNetPnl(trade);

      pnl += tradePnl;

      if (tradePnl > 0) {
        wins++;
      } else if (tradePnl < 0) {
        losses++;
      }
    }

    const winRate =
      currentMonthTrades.length > 0
        ? (wins / currentMonthTrades.length) * 100
        : 0;

    return {
      pnl,
      trades: currentMonthTrades.length,
      wins,
      losses,
      winRate,
    };
  }, [currentMonthTrades]);

  /* ------------------------------------------------------------------------ */
  /* Calendar Data                                                            */
  /* ------------------------------------------------------------------------ */

  const calendarData = useMemo(() => {
    if (!selectedMonth) {
      return {
        cells: [] as Array<{
          day: number | null;
          pnl: number;
          trades: number;
          isToday: boolean;
        }>,
      };
    }

    const date = getMonthDate(selectedMonth);

    if (!date) {
      return { cells: [] };
    }

    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = new Date(
      year,
      month + 1,
      0,
    ).getDate();

    const firstDay = new Date(
      year,
      month,
      1,
    ).getDay();

    const daily: Record<
      string,
      {
        pnl: number;
        trades: number;
      }
    > = {};

    for (const trade of currentMonthTrades) {
      const key = dayKey(trade.exit_time);

      if (!daily[key]) {
        daily[key] = {
          pnl: 0,
          trades: 0,
        };
      }

      daily[key].pnl += getNetPnl(trade);
      daily[key].trades += 1;
    }

    const today = new Date();

    const cells: Array<{
      day: number | null;
      pnl: number;
      trades: number;
      isToday: boolean;
    }> = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({
        day: null,
        pnl: 0,
        trades: 0,
        isToday: false,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const key = `${year}-${String(
        month + 1,
      ).padStart(2, "0")}-${String(day).padStart(
        2,
        "0",
      )}`;

      const info = daily[key] ?? {
        pnl: 0,
        trades: 0,
      };

      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;

      cells.push({
        day,
        pnl: info.pnl,
        trades: info.trades,
        isToday,
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push({
        day: null,
        pnl: 0,
        trades: 0,
        isToday: false,
      });
    }

    return { cells };
  }, [selectedMonth, currentMonthTrades]);

  /* ------------------------------------------------------------------------ */
  /* Month Navigation                                                         */
  /* ------------------------------------------------------------------------ */

  function changeMonth(direction: -1 | 1) {
    if (
      !selectedMonth ||
      monthKeys.length === 0
    ) {
      return;
    }

    const index =
      monthKeys.indexOf(selectedMonth);

    if (index === -1) return;

    const nextIndex = index + direction;

    if (
      nextIndex >= 0 &&
      nextIndex < monthKeys.length
    ) {
      setSelectedMonth(
        monthKeys[nextIndex],
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Monthly Overview                                                         */
  /* ------------------------------------------------------------------------ */

  const monthlyOverview = useMemo(() => {
    return monthKeys.slice(0, 6).map((key) => {
      const monthTrades =
        groupedTrades[key] ?? [];

      let pnl = 0;
      let wins = 0;

      for (const trade of monthTrades) {
        const tradePnl = getNetPnl(trade);

        pnl += tradePnl;

        if (tradePnl > 0) {
          wins++;
        }
      }

      const winRate =
        monthTrades.length > 0
          ? (wins / monthTrades.length) * 100
          : 0;

      return {
        key,
        label: shortMonthLabel(key),
        pnl,
        trades: monthTrades.length,
        winRate,
      };
    });
  }, [monthKeys, groupedTrades]);

  /* ------------------------------------------------------------------------ */
  /* Recent Trades                                                            */
  /* ------------------------------------------------------------------------ */

  const recentTrades = useMemo(() => {
    return [...closedTrades]
      .sort(
        (a, b) =>
          new Date(
            String(b.exit_time),
          ).getTime() -
          new Date(
            String(a.exit_time),
          ).getTime(),
      )
      .slice(0, 5);
  }, [closedTrades]);

  /* ------------------------------------------------------------------------ */
  /* Setup Performance                                                        */
  /* ------------------------------------------------------------------------ */

  const setupPerformance = useMemo(() => {
    const grouped: Record<
      string,
      {
        trades: number;
        pnl: number;
        wins: number;
      }
    > = {};

    for (const trade of closedTrades) {
      const setup =
        trade.setup?.trim() ||
        "No Setup";

      if (!grouped[setup]) {
        grouped[setup] = {
          trades: 0,
          pnl: 0,
          wins: 0,
        };
      }

      const pnl = getNetPnl(trade);

      grouped[setup].trades += 1;
      grouped[setup].pnl += pnl;

      if (pnl > 0) {
        grouped[setup].wins += 1;
      }
    }

    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        ...data,
        winRate:
          data.trades > 0
            ? (data.wins / data.trades) * 100
            : 0,
      }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 5);
  }, [closedTrades]);

  /* ------------------------------------------------------------------------ */
  /* Best / Worst Trading Day                                                 */
  /* ------------------------------------------------------------------------ */

  const dayStats = useMemo(() => {
    const grouped: Record<
      string,
      number
    > = {};

    for (const trade of closedTrades) {
      const key = dayKey(
        trade.exit_time,
      );

      grouped[key] =
        (grouped[key] ?? 0) +
        getNetPnl(trade);
    }

    const days = Object.entries(grouped);

    if (days.length === 0) {
      return {
        best: null,
        worst: null,
      };
    }

    const best = [...days].sort(
      (a, b) => b[1] - a[1],
    )[0];

    const worst = [...days].sort(
      (a, b) => a[1] - b[1],
    )[0];

    return {
      best,
      worst,
    };
  }, [closedTrades]);

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-8">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className={[
                "flex h-14 w-14 items-center justify-center rounded-2xl",
                "bg-[#eef1f5]",
                neutralShadow,
              ].join(" ")}
            >
              <Loader2
                size={24}
                className="animate-spin text-zinc-500"
              />
            </div>

            <p
              className="text-sm text-zinc-500"
              style={numberFontStyle}
            >
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (error) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-8">
        <div className="mx-auto max-w-[1500px]">
          <div
            className={[
              "rounded-[28px] border border-zinc-300/70",
              "bg-[#eef1f5] p-8",
              neutralShadow,
            ].join(" ")}
          >
            <h2
              className="text-xl text-zinc-900"
              style={displayFontStyle}
            >
              Unable to load dashboard
            </h2>

            <p
              className="mt-3 whitespace-pre-line text-sm text-zinc-500"
              style={numberFontStyle}
            >
              {error}
            </p>

            <Link
              href="/trades/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-xs uppercase tracking-[0.12em] text-white transition hover:bg-zinc-800"
            >
              Add Trade
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Empty Dashboard                                                          */
  /* ------------------------------------------------------------------------ */

  if (closedTrades.length === 0) {
    return (
      <main
        className="min-h-screen bg-[#eef1f5] px-4 py-5 sm:px-6 lg:px-8"
        style={numberFontStyle}
      >
        <div className="mx-auto max-w-[1500px]">
          <header className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />

              <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                Trading Journal
              </span>
            </div>

            <h1
              className="text-[28px] font-normal leading-tight tracking-tight text-zinc-950 sm:text-[34px]"
              style={displayFontStyle}
            >
              Welcome back, {firstName} {lastName}.
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Your trading dashboard is ready. Start
              recording your first trade.
            </p>
          </header>

          <div
            className={[
              "flex min-h-[460px] items-center justify-center",
              "rounded-[28px] border border-zinc-300/70",
              "bg-[#eef1f5]",
              neutralShadow,
            ].join(" ")}
          >
            <div className="w-full max-w-md px-6 text-center">
              <div
                className={[
                  "mx-auto mb-6 flex h-20 w-20 items-center justify-center",
                  "rounded-[24px] border border-zinc-300/60",
                  "bg-[#eef1f5] text-zinc-400",
                  insetShadow,
                ].join(" ")}
              >
                <BarChart3
                  size={30}
                  strokeWidth={1.5}
                />
              </div>

              <h2
                className="text-2xl text-zinc-900"
                style={displayFontStyle}
              >
                Build your journal
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Record your trades to see your P&L
                calendar, win rate, setups, monthly
                performance and trading statistics here.
              </p>

              <Link
                href="/trades/new"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-900 px-6 text-[11px] uppercase tracking-[0.14em] text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                <span className="text-lg leading-none">
                  +
                </span>
                Add Your First Trade
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const pnlPositive =
    metrics.totalPnl >= 0;

  const selectedMonthIndex =
    selectedMonth
      ? monthKeys.indexOf(selectedMonth)
      : -1;

  const hasPreviousMonth =
    selectedMonthIndex >= 0 &&
    selectedMonthIndex <
      monthKeys.length - 1;

  const hasNextMonth =
    selectedMonthIndex > 0;

  const profitFactorPositive =
    metrics.profitFactor >= 1;

  return (
    <main
      className="min-h-screen bg-[#eef1f5] px-4 py-5 sm:px-6 lg:px-8"
      style={numberFontStyle}
    >
      <div className="mx-auto max-w-[1500px]">

        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <header className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />

                <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                  Trading Journal
                </span>
              </div>

              <h1
                className="text-[28px] font-normal leading-tight tracking-tight text-zinc-950 sm:text-[34px]"
                style={displayFontStyle}
              >
                Welcome back, {firstName} {lastName}.
              </h1>

              <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
                Here's a clear view of your trading
                performance and progress.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/analytics"
                className={[
                  "inline-flex h-10 items-center gap-2 rounded-xl",
                  "border border-zinc-300/70 bg-[#eef1f5] px-4",
                  "text-[10px] uppercase tracking-[0.12em] text-zinc-500",
                  "transition-all duration-300 hover:-translate-y-0.5",
                  neutralShadow,
                ].join(" ")}
              >
                <BarChart3 size={14} />
                Analytics
              </Link>

              <Link
                href="/trades/new"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-5 text-[10px] uppercase tracking-[0.12em] text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                <span className="text-base leading-none">
                  +
                </span>
                Add Trade
              </Link>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* STAT CARDS                                                        */}
        {/* ================================================================ */}

        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            label="Total P&L"
            value={fmtSignedMoney(
              metrics.totalPnl,
            )}
            subtitle={`${metrics.totalTrades} completed trades`}
            icon={
              pnlPositive ? (
                <TrendingUp size={20} />
              ) : (
                <TrendingDown size={20} />
              )
            }
            positive={pnlPositive}
            valueColor={pnlPositive
              ? PROFIT_COLOR
              : LOSS_COLOR}
          />

          <StatCard
            label="Win Rate"
            value={fmtPercent(
              metrics.winRate,
            )}
            subtitle={`${metrics.profits.length} winning trades`}
            icon={<Target size={20} />}
            positive={
              metrics.winRate >= 50
            }
            valueColor={
              metrics.winRate >= 50
                ? PROFIT_COLOR
                : LOSS_COLOR
            }
          />

          <StatCard
            label="Average Win"
            value={`+${fmtMoney(
              metrics.averageWin,
            )}`}
            subtitle="Average profitable trade"
            icon={<ArrowUpRight size={20} />}
            positive={true}
            valueColor={PROFIT_COLOR}
          />

          <StatCard
            label="Average Loss"
            value={`-${fmtMoney(
              metrics.averageLoss,
            )}`}
            subtitle="Average losing trade"
            icon={
              <ArrowDownRight size={20} />
            }
            positive={false}
            valueColor={LOSS_COLOR}
          />

          <StatCard
            label="Profit Factor"
            value={
              metrics.profitFactor > 0
                ? metrics.profitFactor.toFixed(2)
                : "0.00"
            }
            subtitle={
              profitFactorPositive
                ? "Profitable edge"
                : "Needs improvement"
            }
            icon={<Gauge size={20} />}
            positive={
              profitFactorPositive
            }
            valueColor={
              profitFactorPositive
                ? PROFIT_COLOR
                : LOSS_COLOR
            }
          />
        </section>

        {/* ================================================================ */}
        {/* CALENDAR + MONTH DASHBOARD                                        */}
        {/* ================================================================ */}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.6fr]">

          {/* Calendar */}

          <div
            className={[
              "rounded-[26px] border border-zinc-300/70",
              "bg-[#eef1f5] p-1",
              neutralShadow,
            ].join(" ")}
          >
            <div className="px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      "border border-zinc-300/60 bg-[#eef1f5] text-zinc-500",
                      insetShadow,
                    ].join(" ")}
                  >
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <h2
                      className="text-[18px] text-zinc-900"
                      style={displayFontStyle}
                    >
                      Trading Calendar
                    </h2>

                    <p className="mt-0.5 text-[10px] text-zinc-400">
                      Daily realized P&L
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      !hasPreviousMonth
                    }
                    onClick={() =>
                      changeMonth(1)
                    }
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      "border border-zinc-300/70 bg-[#eef1f5] text-zinc-500",
                      "transition-all hover:-translate-y-0.5",
                      "disabled:cursor-not-allowed disabled:opacity-30",
                      neutralShadow,
                    ].join(" ")}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div
                    className={[
                      "min-w-[155px] rounded-xl border border-zinc-300/60",
                      "bg-[#eef1f5] px-4 py-2 text-center",
                      "text-[11px] uppercase tracking-[0.1em] text-zinc-600",
                      insetShadow,
                    ].join(" ")}
                  >
                    {selectedMonth
                      ? monthYearLabel(
                          selectedMonth,
                        )
                      : "Select Month"}
                  </div>

                  <button
                    type="button"
                    disabled={
                      !hasNextMonth
                    }
                    onClick={() =>
                      changeMonth(-1)
                    }
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      "border border-zinc-300/70 bg-[#eef1f5] text-zinc-500",
                      "transition-all hover:-translate-y-0.5",
                      "disabled:cursor-not-allowed disabled:opacity-30",
                      neutralShadow,
                    ].join(" ")}
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-3 grid grid-cols-7 gap-2">
                  {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map((day) => (
                    <div
                      key={day}
                      className="py-1 text-center text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarData.cells.map(
                    (cell, index) => (
                      <CalendarDay
                        key={`${selectedMonth}-${index}`}
                        day={cell.day}
                        pnl={cell.pnl}
                        trades={cell.trades}
                        isToday={
                          cell.isToday
                        }
                      />
                    ),
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600 shadow-[0_0_10px_rgba(21,128,61,0.55)]" />
                    <span className="text-[9px] uppercase tracking-[0.08em] text-zinc-400">
                      Profitable
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(185,28,28,0.55)]" />
                    <span className="text-[9px] uppercase tracking-[0.08em] text-zinc-400">
                      Losing
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <span className="text-[9px] uppercase tracking-[0.08em] text-zinc-400">
                      No trades
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Month Dashboard */}

          <div
            className={[
              "rounded-[26px] border border-zinc-300/70",
              "bg-[#eef1f5] p-5 sm:p-6",
              neutralShadow,
            ].join(" ")}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-400">
                  Selected Month
                </p>

                <h2
                  className="mt-1 text-[20px] text-zinc-900"
                  style={displayFontStyle}
                >
                  {selectedMonth
                    ? monthYearLabel(
                        selectedMonth,
                      )
                    : "—"}
                </h2>
              </div>

              <div
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-xl",
                  "border border-zinc-300/60 bg-[#eef1f5]",
                  pnlIconColor(
                    currentMonthStats.pnl >= 0,
                  ),
                  insetShadow,
                ].join(" ")}
              >
                {currentMonthStats.pnl >=
                0 ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )}
              </div>
            </div>

            {/* Monthly P&L */}

            <div
              className={[
                "rounded-2xl border bg-[#eef1f5] p-5",
                "transition-all duration-300 hover:-translate-y-1",
                pnlHoverBorder(
                  currentMonthStats.pnl >=
                    0,
                ),
                pnlShadow(
                  currentMonthStats.pnl >=
                    0,
                ),
              ].join(" ")}
            >
              <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                Monthly Net P&L
              </p>

              <div
                className="mt-2 text-[29px] font-medium tracking-tight"
                style={{
                  ...numberFontStyle,
                  color:
                    currentMonthStats.pnl >=
                    0
                      ? PROFIT_COLOR
                      : LOSS_COLOR,
                }}
              >
                {fmtSignedMoney(
                  currentMonthStats.pnl,
                )}
              </div>

              <p className="mt-1 text-[10px] text-zinc-400">
                {currentMonthStats.trades}{" "}
                completed trades
              </p>
            </div>

            {/* Month Mini Stats */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                {
                  label: "Win Rate",
                  value: fmtPercent(
                    currentMonthStats.winRate,
                  ),
                  color: "#27272a",
                  positive:
                    undefined as
                      | boolean
                      | undefined,
                },
                {
                  label: "Winning",
                  value:
                    currentMonthStats.wins,
                  color: PROFIT_COLOR,
                  positive: true,
                },
                {
                  label: "Losing",
                  value:
                    currentMonthStats.losses,
                  color: LOSS_COLOR,
                  positive: false,
                },
                {
                  label: "Avg Trade",
                  value:
                    currentMonthStats.trades >
                    0
                      ? fmtSignedMoney(
                          currentMonthStats.pnl /
                            currentMonthStats.trades,
                        )
                      : "$0.00",
                  color:
                    currentMonthStats.pnl >=
                    0
                      ? PROFIT_COLOR
                      : LOSS_COLOR,
                  positive:
                    currentMonthStats.pnl >=
                    0,
                },
              ].map((item) => {
                const isPnl =
                  item.positive !==
                  undefined;

                return (
                  <div
                    key={item.label}
                    className={[
                      "rounded-2xl border bg-[#eef1f5] p-4",
                      "transition-all duration-300 hover:-translate-y-0.5",
                      isPnl
                        ? pnlHoverBorder(
                            item.positive as boolean,
                          )
                        : "border-zinc-300/60",
                      isPnl
                        ? pnlShadow(
                            item.positive as boolean,
                          )
                        : neutralShadow,
                    ].join(" ")}
                  >
                    <p className="text-[8px] uppercase tracking-[0.1em] text-zinc-400">
                      {item.label}
                    </p>

                    <p
                      className="mt-2 text-[17px]"
                      style={{
                        ...numberFontStyle,
                        color: item.color,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Recent Months */}

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                  Recent Months
                </p>

                <Link
                  href="/analytics"
                  className="text-[9px] uppercase tracking-[0.1em] text-zinc-400 transition hover:text-zinc-800"
                >
                  Analytics
                </Link>
              </div>

              <div className="space-y-3">
                {monthlyOverview.map(
                  (month) => {
                    const positive =
                      month.pnl >= 0;

                    const active =
                      month.key ===
                      selectedMonth;

                    return (
                      <button
                        key={month.key}
                        type="button"
                        onClick={() =>
                          setSelectedMonth(
                            month.key,
                          )
                        }
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-xl border bg-[#eef1f5] px-4 py-3 text-left",
                          "transition-all duration-300 hover:-translate-y-0.5",
                          pnlHoverBorder(
                            positive,
                          ),
                          pnlShadow(
                            positive,
                          ),
                          active
                            ? "scale-[1.01] ring-1 ring-zinc-400/60"
                            : "",
                        ].join(" ")}
                      >
                        <div>
                          <p className="text-[10px] text-zinc-600">
                            {month.label}
                          </p>

                          <p className="mt-1 text-[8px] text-zinc-400">
                            {month.trades}{" "}
                            trades ·{" "}
                            {fmtPercent(
                              month.winRate,
                            )}
                          </p>
                        </div>

                        <span
                          className="text-[10px]"
                          style={{
                            ...numberFontStyle,
                            color:
                              positive
                                ? PROFIT_COLOR
                                : LOSS_COLOR,
                          }}
                        >
                          {fmtSignedMoney(
                            month.pnl,
                          )}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* BEST / WORST DAY                                                  */}
        {/* ================================================================ */}

        <section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Best Trading Day */}

          <div
            className={[
              "rounded-[22px] border bg-[#eef1f5] p-5",
              "border-zinc-300/70 hover:border-green-600/10",
              "transition-all duration-300 hover:-translate-y-1",
              profitShadow,
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                  Best Trading Day
                </p>

                <p
                  className="mt-2 text-[17px] text-zinc-800"
                  style={numberFontStyle}
                >
                  {dayStats.best
                    ? fmtDate(
                        dayStats.best[0],
                      )
                    : "—"}
                </p>
              </div>

              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  "border border-zinc-300/60",
                  "bg-[#eef1f5] text-green-700",
                  insetShadow,
                ].join(" ")}
              >
                <TrendingUp size={17} />
              </div>
            </div>

            {dayStats.best && (
              <p
                className="mt-2 text-[14px]"
                style={{
                  ...numberFontStyle,
                  color: PROFIT_COLOR,
                }}
              >
                {fmtSignedMoney(
                  dayStats.best[1],
                )}
              </p>
            )}
          </div>

          {/* Worst Trading Day */}

          <div
            className={[
              "rounded-[22px] border bg-[#eef1f5] p-5",
              "border-zinc-300/70 hover:border-red-600/10",
              "transition-all duration-300 hover:-translate-y-1",
              lossShadow,
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                  Worst Trading Day
                </p>

                <p
                  className="mt-2 text-[17px] text-zinc-800"
                  style={numberFontStyle}
                >
                  {dayStats.worst
                    ? fmtDate(
                        dayStats.worst[0],
                      )
                    : "—"}
                </p>
              </div>

              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  "border border-zinc-300/60",
                  "bg-[#eef1f5] text-red-700",
                  insetShadow,
                ].join(" ")}
              >
                <TrendingDown size={17} />
              </div>
            </div>

            {dayStats.worst && (
              <p
                className="mt-2 text-[14px]"
                style={{
                  ...numberFontStyle,
                  color: LOSS_COLOR,
                }}
              >
                {fmtSignedMoney(
                  dayStats.worst[1],
                )}
              </p>
            )}
          </div>
        </section>

        {/* ================================================================ */}
        {/* RECENT TRADES + SETUPS                                            */}
        {/* ================================================================ */}

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">

          {/* Recent Trades */}

          <div
            className={[
              "rounded-[26px] border border-zinc-300/70",
              "bg-[#eef1f5] p-1",
              neutralShadow,
            ].join(" ")}
          >
            <div className="px-6 py-5 sm:px-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="text-zinc-500"
                    />

                    <h2
                      className="text-[17px] text-zinc-900"
                      style={displayFontStyle}
                    >
                      Recent Trades
                    </h2>
                  </div>

                  <p className="mt-1 text-[10px] text-zinc-400">
                    Your latest completed positions.
                  </p>
                </div>

                <Link
                  href="/trades"
                  className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-zinc-400 transition hover:text-zinc-900"
                >
                  View All
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="space-y-3">
                {recentTrades.map(
                  (trade) => {
                    const pnl =
                      getNetPnl(trade);

                    const positive =
                      pnl >= 0;

                    return (
                      <Link
                        key={trade.id}
                        href={`/trades/${trade.id}`}
                        className={[
                          "group flex items-center justify-between gap-4 rounded-2xl border bg-[#eef1f5] px-5 py-4",
                          "transition-all duration-300 hover:-translate-y-1",
                          pnlHoverBorder(
                            positive,
                          ),
                          pnlShadow(
                            positive,
                          ),
                        ].join(" ")}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                              "border border-zinc-300/60 bg-[#eef1f5]",
                              pnlIconColor(
                                positive,
                              ),
                              insetShadow,
                            ].join(" ")}
                          >
                            {trade.direction?.slice(
                              0,
                              1,
                            )}
                          </div>

                          <div className="min-w-0">
                            <div
                              className="truncate text-[14px] text-zinc-800"
                              style={
                                displayFontStyle
                              }
                            >
                              {trade.symbol}
                            </div>

                            <div className="mt-1 flex items-center gap-2 text-[9px] text-zinc-400">
                              <span>
                                {
                                  trade.direction
                                }
                              </span>

                              <span>•</span>

                              <span>
                                {fmtDate(
                                  trade.exit_time,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className="text-[13px]"
                            style={{
                              ...numberFontStyle,
                              color:
                                positive
                                  ? PROFIT_COLOR
                                  : LOSS_COLOR,
                            }}
                          >
                            {fmtSignedMoney(
                              pnl,
                            )}
                          </div>

                          <div className="mt-1 text-[9px] text-zinc-400">
                            {trade.lots} lots
                          </div>
                        </div>
                      </Link>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* Setup Performance */}

          <div
            className={[
              "rounded-[26px] border border-zinc-300/70",
              "bg-[#eef1f5] p-6 sm:p-7",
              neutralShadow,
            ].join(" ")}
          >
            <div className="mb-6 flex items-center gap-2">
              <FileText
                size={16}
                className="text-zinc-500"
              />

              <h2
                className="text-[17px] text-zinc-900"
                style={displayFontStyle}
              >
                Setup Performance
              </h2>
            </div>

            {setupPerformance.length ===
            0 ? (
              <div
                className={[
                  "flex h-[180px] items-center justify-center rounded-2xl",
                  "border border-zinc-300/60",
                  "bg-[#eef1f5]",
                  insetShadow,
                ].join(" ")}
              >
                <p className="text-sm text-zinc-400">
                  No setup data yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {setupPerformance.map(
                  (setup) => {
                    const positive =
                      setup.pnl >= 0;

                    return (
                      <div
                        key={setup.name}
                        className={[
                          "rounded-2xl border bg-[#eef1f5] p-4",
                          "transition-all duration-300 hover:-translate-y-0.5",
                          pnlHoverBorder(
                            positive,
                          ),
                          pnlShadow(
                            positive,
                          ),
                        ].join(" ")}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="truncate text-[11px] text-zinc-600">
                            {setup.name}
                          </span>

                          <span
                            className="text-[10px]"
                            style={{
                              ...numberFontStyle,
                              color:
                                positive
                                  ? PROFIT_COLOR
                                  : LOSS_COLOR,
                            }}
                          >
                            {fmtSignedMoney(
                              setup.pnl,
                            )}
                          </span>
                        </div>

                        <div
                          className={[
                            "h-1.5 overflow-hidden rounded-full",
                            "border border-zinc-300/40 bg-[#e6e9ee]",
                            insetShadow,
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "h-full rounded-full",
                              positive
                                ? "bg-green-700 shadow-[0_0_8px_rgba(21,128,61,0.45)]"
                                : "bg-red-700 shadow-[0_0_8px_rgba(185,28,28,0.45)]",
                            ].join(" ")}
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  setup.winRate,
                                  8,
                                ),
                                100,
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="mt-3 flex justify-between text-[8px] uppercase tracking-[0.08em] text-zinc-400">
                          <span>
                            {setup.trades}{" "}
                            trades
                          </span>

                          <span>
                            {fmtPercent(
                              setup.winRate,
                            )}{" "}
                            win rate
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </section>

        {/* ================================================================ */}
        {/* BEST / WORST TRADE                                                */}
        {/* ================================================================ */}

        <section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Best Trade */}

          <div
            className={[
              "rounded-[22px] border bg-[#eef1f5] p-5",
              "border-zinc-300/70 hover:border-green-600/10",
              "transition-all duration-300 hover:-translate-y-1",
              profitShadow,
            ].join(" ")}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                  Best Trade
                </p>

                <p
                  className="mt-1.5 text-lg text-zinc-900"
                  style={displayFontStyle}
                >
                  {metrics.bestTrade
                    ?.symbol ?? "—"}
                </p>
              </div>

              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  "border border-zinc-300/60",
                  "bg-[#eef1f5] text-green-700",
                  insetShadow,
                ].join(" ")}
              >
                <Trophy size={17} />
              </div>
            </div>

            {metrics.bestTrade && (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] text-zinc-400">
                    {fmtDate(
                      metrics.bestTrade
                        .exit_time,
                    )}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-zinc-400">
                    {
                      metrics.bestTrade
                        .direction
                    }{" "}
                    ·{" "}
                    {
                      metrics.bestTrade
                        .lots
                    }{" "}
                    lots
                  </p>
                </div>

                <span
                  className="text-[14px]"
                  style={{
                    ...numberFontStyle,
                    color: PROFIT_COLOR,
                  }}
                >
                  {fmtSignedMoney(
                    getNetPnl(
                      metrics.bestTrade,
                    ),
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Largest Loss */}

          <div
            className={[
              "rounded-[22px] border bg-[#eef1f5] p-5",
              "border-zinc-300/70 hover:border-red-600/10",
              "transition-all duration-300 hover:-translate-y-1",
              lossShadow,
            ].join(" ")}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                  Largest Loss
                </p>

                <p
                  className="mt-1.5 text-lg text-zinc-900"
                  style={displayFontStyle}
                >
                  {metrics.worstTrade
                    ?.symbol ?? "—"}
                </p>
              </div>

              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  "border border-zinc-300/60",
                  "bg-[#eef1f5] text-red-700",
                  insetShadow,
                ].join(" ")}
              >
                <TrendingDown size={17} />
              </div>
            </div>

            {metrics.worstTrade && (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] text-zinc-400">
                    {fmtDate(
                      metrics.worstTrade
                        .exit_time,
                    )}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-zinc-400">
                    {
                      metrics.worstTrade
                        .direction
                    }{" "}
                    ·{" "}
                    {
                      metrics.worstTrade
                        .lots
                    }{" "}
                    lots
                  </p>
                </div>

                <span
                  className="text-[14px]"
                  style={{
                    ...numberFontStyle,
                    color: LOSS_COLOR,
                  }}
                >
                  {fmtSignedMoney(
                    getNetPnl(
                      metrics.worstTrade,
                    ),
                  )}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================ */}
        {/* FOOTER                                                           */}
        {/* ================================================================ */}

        <section className="mt-5 pb-5">
          <div
            className={[
              "flex flex-col gap-4 rounded-[22px]",
              "border border-zinc-300/70",
              "bg-[#eef1f5] px-6 py-5",
              "sm:flex-row sm:items-center sm:justify-between",
              neutralShadow,
            ].join(" ")}
          >
            <div className="flex items-center gap-4">
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  "border border-zinc-300/60",
                  "bg-[#eef1f5] text-zinc-500",
                  insetShadow,
                ].join(" ")}
              >
                <Wallet size={16} />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                  Journal Status
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  You currently have{" "}
                  <span className="text-zinc-900">
                    {metrics.totalTrades}{" "}
                    completed trades
                  </span>{" "}
                  recorded in your journal.
                </p>
              </div>
            </div>

            <Link
              href="/trades"
              className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-zinc-500 transition hover:text-zinc-900"
            >
              Review Journal
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}