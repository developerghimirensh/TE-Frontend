"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Loader2,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getTrades, type Trade } from "@/lib/api";

/* ==========================================================================
   FONTS
   ========================================================================== */

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

/* ==========================================================================
   COLORS
   ========================================================================== */

const PROFIT_COLOR = "#15803d";
const PROFIT_BRIGHT = "#22c55e";

const LOSS_COLOR = "#b91c1c";
const LOSS_BRIGHT = "#ef4444";

const SURFACE = "#eef1f5";

/* ==========================================================================
   REUSABLE SHADOWS
   ========================================================================== */

const neutralShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_25px_rgba(163,177,198,0.30),-10px_-10px_25px_rgba(255,255,255,1)]";

const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.18),inset_-5px_-5px_12px_rgba(255,255,255,0.90)]";

/*
 * P&L glow is present on the shadow system,
 * but the BORDER itself remains neutral until hover.
 */

const profitShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.22),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_26px_rgba(163,177,198,0.26),-10px_-10px_26px_rgba(255,255,255,1)]";

const lossShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.22),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_26px_rgba(163,177,198,0.26),-10px_-10px_26px_rgba(255,255,255,1)]";

/* ==========================================================================
   COMMON CLASS HELPERS
   ========================================================================== */

const neutralBorder = "border border-zinc-300/70";

const surfaceCard = `${neutralBorder} bg-[${SURFACE}]`;

function pnlHoverBorder(
  positive: boolean | null | undefined,
): string {
  if (positive === true) {
    return "hover:border-green-600/10";
  }

  if (positive === false) {
    return "hover:border-red-600/10";
  }

  return "";
}

function pnlShadow(
  positive: boolean | null | undefined,
): string {
  if (positive === true) return profitShadow;
  if (positive === false) return lossShadow;

  return neutralShadow;
}

function pnlTextColor(positive: boolean | null | undefined): string {
  if (positive === true) return PROFIT_COLOR;
  if (positive === false) return LOSS_COLOR;

  return "#18181b";
}

function pnlIconColor(positive: boolean | null | undefined): string {
  if (positive === true) return "text-green-700";
  if (positive === false) return "text-red-700";

  return "text-zinc-500";
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

function toNum(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getNetPnl(trade: Trade): number {
  return toNum(trade.pnl) - toNum(trade.fees);
}

function fmtMoney(value: number): string {
  return `$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtSignedMoney(value: number): string {
  return `${value >= 0 ? "+" : "-"}${fmtMoney(value)}`;
}

function fmtNumber(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtPercent(value: number): string {
  return `${fmtNumber(value, 1)}%`;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;

  const date = new Date(String(value));

  return Number.isNaN(date.getTime()) ? null : date;
}

function monthKey(value: unknown): string {
  const date = parseDate(value);

  if (!date) return "unknown";

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  if (key === "unknown") return "Unknown";

  const [year, month] = key.split("-").map(Number);

  if (!year || !month) return "Unknown";

  return new Date(year, month - 1, 1).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );
}

function dayKey(value: unknown): string {
  const date = parseDate(value);

  if (!date) return "unknown";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getMonthDate(key: string): Date | null {
  if (key === "unknown") return null;

  const [year, month] = key.split("-").map(Number);

  if (!year || !month) return null;

  return new Date(year, month - 1, 1);
}

function formatDate(value: unknown): string {
  const date = parseDate(value);

  if (!date) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isClosedTrade(trade: Trade): boolean {
  return (
    trade.exit_time !== null &&
    trade.exit_time !== undefined &&
    trade.exit_price !== null &&
    trade.exit_price !== undefined
  );
}

/* ==========================================================================
   SMALL REUSABLE ICON BOX
   ========================================================================== */

function IconBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex items-center justify-center rounded-xl bg-[#eef1f5]",
        insetShadow,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ==========================================================================
   STAT CARD
   ========================================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  positive,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  positive?: boolean | null;
}) {
  return (
    <div
      className={[
        "group rounded-[13px]",
        "border border-zinc-300/70",
        "bg-[#eef1f5] p-2.5",
        "transition-all duration-300 hover:-translate-y-1",
        pnlHoverBorder(positive),
        pnlShadow(positive),
      ].join(" ")}
    >
      <div className="mb-2.5 flex items-start justify-between">
        <p
          className="text-[7px] uppercase tracking-[0.12em] text-zinc-400"
          style={numberFontStyle}
        >
          {title}
        </p>

        <IconBox
          className={[
            "h-5 w-5",
            pnlIconColor(positive),
          ].join(" ")}
        >
          {icon}
        </IconBox>
      </div>

      <div
        className="text-[14px] font-medium tracking-tight sm:text-[15px]"
        style={{
          ...numberFontStyle,
          color: pnlTextColor(positive),
        }}
      >
        {value}
      </div>

      {subtitle && (
        <p
          className="mt-1 text-[7px] text-zinc-400"
          style={numberFontStyle}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   CHART TOOLTIP
   ========================================================================== */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={[
        "rounded-xl border border-zinc-300/70",
        "bg-[#eef1f5] px-4 py-3",
        neutralShadow,
      ].join(" ")}
      style={numberFontStyle}
    >
      <p className="mb-2 text-xs text-zinc-400">{label}</p>

      {payload.map((item, index) => {
        const value = item.value ?? 0;

        return (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between gap-6"
          >
            <span className="text-xs text-zinc-500">
              {item.name || "Value"}
            </span>

            <span
              className="text-sm font-medium"
              style={{
                color:
                  value >= 0
                    ? PROFIT_COLOR
                    : LOSS_COLOR,
              }}
            >
              {item.name?.toLowerCase().includes("rate")
                ? fmtPercent(value)
                : fmtSignedMoney(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   CALENDAR DAY
   ========================================================================== */

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
        "group relative min-h-[74px] rounded-xl",
        "border border-zinc-300/60",
        "bg-[#eef1f5] p-2",
        "transition-all duration-300 hover:-translate-y-[2px]",
        hasTrades
          ? positive
            ? "hover:border-green-600/30"
            : "hover:border-red-600/30"
          : "",
        hasTrades
          ? positive
            ? profitShadow
            : lossShadow
          : neutralShadow,
        isToday ? "ring-[0.5px] ring-zinc-300" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={[
            "flex h-6 w-6 items-center justify-center rounded-lg text-[10px]",
            isToday
              ? "text-white bg-amber-950"
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
            color: positive
              ? PROFIT_COLOR
              : LOSS_COLOR,
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

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export default function AnalyticsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] =
    useState<string>("all");

  const [monthMenuOpen, setMonthMenuOpen] =
    useState(false);

  const monthMenuRef =
    useRef<HTMLDivElement>(null);

  const [calendarMonth, setCalendarMonth] =
    useState<string | null>(null);

  /* ========================================================================
     LOAD TRADES
     ======================================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadTrades() {
      try {
        setLoading(true);
        setError(null);

        const result = await getTrades();

        if (!cancelled) {
          setTrades(result ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load analytics data.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTrades();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================================================
     CLOSE DROPDOWN
     ======================================================================== */

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        monthMenuRef.current &&
        !monthMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setMonthMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick,
      );
    };
  }, []);

  /* ========================================================================
     CLOSED TRADES
     ======================================================================== */

  const closedTrades = useMemo(
    () =>
      trades
        .filter(isClosedTrade)
        .sort(
          (a, b) =>
            new Date(
              String(a.exit_time),
            ).getTime() -
            new Date(
              String(b.exit_time),
            ).getTime(),
        ),
    [trades],
  );

  /* ========================================================================
     MONTHS
     ======================================================================== */

  const months = useMemo(() => {
    return Array.from(
      new Set(
        closedTrades.map((trade) =>
          monthKey(trade.exit_time),
        ),
      ),
    ).sort((a, b) => b.localeCompare(a));
  }, [closedTrades]);

  /* ========================================================================
     FILTERED TRADES
     ======================================================================== */

  const filteredTrades = useMemo(() => {
    if (selectedMonth === "all") {
      return closedTrades;
    }

    return closedTrades.filter(
      (trade) =>
        monthKey(trade.exit_time) ===
        selectedMonth,
    );
  }, [
    closedTrades,
    selectedMonth,
  ]);

  /* ========================================================================
     ANALYTICS
     ======================================================================== */

  const analytics = useMemo(() => {
    let totalPnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    const profits: Trade[] = [];
    const losses: Trade[] = [];
    const breakeven: Trade[] = [];

    let bestTrade: Trade | null = null;
    let worstTrade: Trade | null = null;

    for (const trade of filteredTrades) {
      const pnl = getNetPnl(trade);

      totalPnl += pnl;

      if (pnl > 0) {
        profits.push(trade);
        grossProfit += pnl;
      } else if (pnl < 0) {
        losses.push(trade);
        grossLoss += Math.abs(pnl);
      } else {
        breakeven.push(trade);
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

    const totalTrades = filteredTrades.length;

    const winRate =
      totalTrades > 0
        ? (profits.length / totalTrades) * 100
        : 0;

    const profitFactor =
      grossLoss === 0
        ? grossProfit > 0
          ? grossProfit
          : 0
        : grossProfit / grossLoss;

    const averageWin =
      profits.length > 0
        ? grossProfit / profits.length
        : 0;

    const averageLoss =
      losses.length > 0
        ? -grossLoss / losses.length
        : 0;

    const expectancy =
      totalTrades > 0
        ? totalPnl / totalTrades
        : 0;

    return {
      totalTrades,
      profits,
      losses,
      breakeven,
      totalPnl,
      grossProfit,
      grossLoss,
      winRate,
      profitFactor,
      averageWin,
      averageLoss,
      expectancy,
      bestTrade,
      worstTrade,
    };
  }, [filteredTrades]);

  /* ========================================================================
     EQUITY CURVE
     ======================================================================== */

  const equityData = useMemo(() => {
    let cumulative = 0;

    return filteredTrades.map(
      (trade, index) => {
        const pnl = getNetPnl(trade);

        cumulative += pnl;

        return {
          index: index + 1,
          trade: `Trade ${index + 1}`,
          pnl,
          equity: cumulative,
        };
      },
    );
  }, [filteredTrades]);

  /* ========================================================================
     DIRECTION PERFORMANCE
     ======================================================================== */

  const directionData = useMemo(() => {
    const groups: Record<
      string,
      {
        pnl: number;
        trades: number;
        wins: number;
      }
    > = {};

    for (const trade of filteredTrades) {
      const direction =
        String(
          trade.direction ?? "",
        ).toUpperCase() || "UNKNOWN";

      if (!groups[direction]) {
        groups[direction] = {
          pnl: 0,
          trades: 0,
          wins: 0,
        };
      }

      const pnl = getNetPnl(trade);

      groups[direction].pnl += pnl;
      groups[direction].trades += 1;

      if (pnl > 0) {
        groups[direction].wins += 1;
      }
    }

    return Object.entries(groups).map(
      ([direction, data]) => ({
        direction,
        pnl: data.pnl,
        trades: data.trades,
        wins: data.wins,
        winRate:
          data.trades > 0
            ? (data.wins / data.trades) * 100
            : 0,
        avg:
          data.trades > 0
            ? data.pnl / data.trades
            : 0,
      }),
    );
  }, [filteredTrades]);

  /* ========================================================================
     SETUP PERFORMANCE
     ======================================================================== */

  const setupData = useMemo(() => {
    const groups: Record<
      string,
      {
        pnl: number;
        trades: number;
        wins: number;
      }
    > = {};

    for (const trade of filteredTrades) {
      const setup =
        trade.setup?.trim() ||
        "No Setup";

      if (!groups[setup]) {
        groups[setup] = {
          pnl: 0,
          trades: 0,
          wins: 0,
        };
      }

      const pnl = getNetPnl(trade);

      groups[setup].pnl += pnl;
      groups[setup].trades += 1;

      if (pnl > 0) {
        groups[setup].wins += 1;
      }
    }

    return Object.entries(groups)
      .map(([setup, data]) => ({
        setup,
        pnl: data.pnl,
        trades: data.trades,
        winRate:
          data.trades > 0
            ? (data.wins / data.trades) * 100
            : 0,
      }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 6);
  }, [filteredTrades]);

  /* ========================================================================
     WIN / LOSS DATA
     ======================================================================== */

  const winLossData = useMemo(
    () =>
      [
        {
          name: "Wins",
          value: analytics.profits.length,
          color: PROFIT_BRIGHT,
        },
        {
          name: "Losses",
          value: analytics.losses.length,
          color: LOSS_BRIGHT,
        },
        {
          name: "Breakeven",
          value: analytics.breakeven.length,
          color: "#c7ccd6",
        },
      ].filter((item) => item.value > 0),
    [analytics],
  );

  /* ========================================================================
     CALENDAR SYNC
     ======================================================================== */

  useEffect(() => {
    if (!calendarMonth && months.length > 0) {
      setCalendarMonth(months[0]);
      return;
    }

    if (
      calendarMonth &&
      months.length > 0 &&
      !months.includes(calendarMonth)
    ) {
      setCalendarMonth(months[0]);
    }
  }, [months, calendarMonth]);

  /* ========================================================================
     CALENDAR TRADES
     ======================================================================== */

  const calendarMonthTrades = useMemo(() => {
    if (!calendarMonth) return [];

    return closedTrades.filter(
      (trade) =>
        monthKey(trade.exit_time) ===
        calendarMonth,
    );
  }, [
    closedTrades,
    calendarMonth,
  ]);

  /* ========================================================================
     CALENDAR STATS
     ======================================================================== */

  const calendarStats = useMemo(() => {
    let pnl = 0;
    let wins = 0;
    let losses = 0;

    for (const trade of calendarMonthTrades) {
      const tradePnl = getNetPnl(trade);

      pnl += tradePnl;

      if (tradePnl > 0) wins++;
      if (tradePnl < 0) losses++;
    }

    const trades = calendarMonthTrades.length;

    return {
      pnl,
      trades,
      wins,
      losses,
      winRate:
        trades > 0
          ? (wins / trades) * 100
          : 0,
    };
  }, [calendarMonthTrades]);

  /* ========================================================================
     CALENDAR DATA
     ======================================================================== */

  const calendarData = useMemo(() => {
    if (!calendarMonth) {
      return { cells: [] };
    }

    const date =
      getMonthDate(calendarMonth);

    if (!date) {
      return { cells: [] };
    }

    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0,
      ).getDate();

    const firstDay =
      new Date(
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

    for (const trade of calendarMonthTrades) {
      const key = dayKey(
        trade.exit_time,
      );

      if (!daily[key]) {
        daily[key] = {
          pnl: 0,
          trades: 0,
        };
      }

      daily[key].pnl +=
        getNetPnl(trade);

      daily[key].trades++;
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
      ).padStart(2, "0")}-${String(
        day,
      ).padStart(2, "0")}`;

      const info =
        daily[key] ?? {
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
  }, [
    calendarMonth,
    calendarMonthTrades,
  ]);

  /* ========================================================================
     CALENDAR NAVIGATION
     ======================================================================== */

  function changeCalendarMonth(
    direction: -1 | 1,
  ) {
    if (
      !calendarMonth ||
      months.length === 0
    ) {
      return;
    }

    const index =
      months.indexOf(calendarMonth);

    if (index === -1) return;

    const nextIndex =
      index + direction;

    if (
      nextIndex >= 0 &&
      nextIndex < months.length
    ) {
      setCalendarMonth(
        months[nextIndex],
      );
    }
  }

  const calendarMonthIndex =
    calendarMonth
      ? months.indexOf(calendarMonth)
      : -1;

  const hasPreviousCalendarMonth =
    calendarMonthIndex >= 0 &&
    calendarMonthIndex <
      months.length - 1;

  const hasNextCalendarMonth =
    calendarMonthIndex > 0;

  /* ========================================================================
     LOADING
     ======================================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <IconBox className="h-14 w-14 rounded-2xl border border-zinc-300/70">
              <Loader2
                size={24}
                className="animate-spin text-zinc-500"
              />
            </IconBox>

            <p
              className="text-sm font-normal text-zinc-500"
              style={numberFontStyle}
            >
              Loading analytics...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ========================================================================
     ERROR
     ======================================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-8">
        <div className="mx-auto max-w-[1500px]">
          <div
            className={[
              "rounded-[28px]",
              "border border-zinc-300/70",
              "bg-[#eef1f5] p-8",
              neutralShadow,
            ].join(" ")}
          >
            <IconBox className="h-14 w-14 text-red-600">
              <XCircle size={24} />
            </IconBox>

            <h2
              className="mt-4 text-xl font-normal text-zinc-900"
              style={displayFontStyle}
            >
              Unable to load analytics
            </h2>

            <p
              className="mt-2 text-sm text-zinc-500"
              style={numberFontStyle}
            >
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ========================================================================
     DERIVED DISPLAY VALUES
     ======================================================================== */

  const pnlPositive =
    analytics.totalPnl >= 0;

  const winPercent =
    analytics.totalTrades > 0
      ? (analytics.profits.length /
          analytics.totalTrades) *
        100
      : 0;

  const lossPercent =
    analytics.totalTrades > 0
      ? (analytics.losses.length /
          analytics.totalTrades) *
        100
      : 0;

  const breakevenPercent =
    analytics.totalTrades > 0
      ? (analytics.breakeven.length /
          analytics.totalTrades) *
        100
      : 0;

  /* ========================================================================
     MAIN
     ======================================================================== */

  return (
    <main
      className="min-h-screen bg-[#eef1f5] px-4 py-5 sm:px-6 lg:px-8"
      style={numberFontStyle}
    >
      <div className="mx-auto max-w-[1500px]">

        {/* ================================================================
            HEADER
        ================================================================= */}

        <header className="mb-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />

                <span className="text-[10px] font-normal uppercase tracking-[0.16em] text-zinc-400">
                 The Millionaire Diary
                </span>
              </div>

              <h1
                className="text-[28px] font-normal leading-tight tracking-tight text-zinc-950 sm:text-[34px]"
                style={displayFontStyle}
              >
                Analytics
              </h1>

              <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
                Understand your trading performance and identify your edge.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={[
                  "inline-flex h-10 items-center gap-2",
                  "rounded-xl border border-zinc-300/70",
                  "bg-[#eef1f5] px-4",
                  "text-[10px] uppercase tracking-[0.12em] text-zinc-500",
                  "transition-all duration-300 hover:-translate-y-0.5",
                  neutralShadow,
                ].join(" ")}
              >
                <ArrowLeft size={14} />
                Dashboard
              </Link>

              {/* Month Dropdown */}

              <div
                className="relative w-full sm:w-[220px]"
                ref={monthMenuRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setMonthMenuOpen(
                      (open) => !open,
                    )
                  }
                  className={[
                    "flex h-10 w-full items-center gap-2",
                    "rounded-xl border border-zinc-300/70",
                    "bg-[#eef1f5] px-4",
                    "text-left text-xs text-zinc-600",
                    "transition-all duration-300",
                    monthMenuOpen
                      ? insetShadow
                      : neutralShadow,
                  ].join(" ")}
                >
                  <CalendarDays
                    size={14}
                    className="shrink-0 text-zinc-400"
                  />

                  <span className="flex-1 truncate">
                    {selectedMonth === "all"
                      ? "All Time"
                      : monthLabel(
                          selectedMonth,
                        )}
                  </span>

                  <ChevronDown
                    size={14}
                    className={[
                      "shrink-0 text-zinc-400",
                      "transition-transform duration-300",
                      monthMenuOpen
                        ? "rotate-180"
                        : "",
                    ].join(" ")}
                  />
                </button>

                {monthMenuOpen && (
                  <div
                    className={[
                      "absolute right-0 z-20 mt-2 w-full min-w-[220px]",
                      "rounded-2xl border border-zinc-300/70",
                      "bg-[#eef1f5] p-2",
                      neutralShadow,
                    ].join(" ")}
                  >
                    <div className="max-h-64 space-y-1 overflow-y-auto">

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMonth("all");
                          setMonthMenuOpen(false);
                        }}
                        className={[
                          "flex w-full items-center justify-between",
                          "rounded-xl px-3 py-2",
                          "text-left text-xs",
                          "transition-all duration-200",
                          selectedMonth === "all"
                            ? [
                                "bg-[#eef1f5] text-zinc-900",
                                insetShadow,
                              ].join(" ")
                            : "text-zinc-500 hover:bg-[#e6e9ee]",
                        ].join(" ")}
                      >
                        All Time
                      </button>

                      {months.map(
                        (month) => (
                          <button
                            key={month}
                            type="button"
                            onClick={() => {
                              setSelectedMonth(
                                month,
                              );
                              setMonthMenuOpen(
                                false,
                              );
                            }}
                            className={[
                              "flex w-full items-center justify-between",
                              "rounded-xl px-3 py-2",
                              "text-left text-xs",
                              "transition-all duration-200",
                              selectedMonth ===
                              month
                                ? [
                                    "bg-[#eef1f5] text-zinc-900",
                                    insetShadow,
                                  ].join(
                                    " ",
                                  )
                                : "text-zinc-500 hover:bg-[#e6e9ee]",
                            ].join(" ")}
                          >
                            {monthLabel(
                              month,
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ================================================================
            NO DATA
        ================================================================= */}

        {filteredTrades.length === 0 ? (
          <div className="flex min-h-[55vh] items-center justify-center">
            <div
              className={[
                "w-full max-w-md rounded-[28px]",
                "border border-zinc-300/70",
                "bg-[#eef1f5] p-10 text-center",
                neutralShadow,
              ].join(" ")}
            >
              <IconBox className="mx-auto mb-5 h-16 w-16 rounded-2xl text-zinc-400">
                <BarChart3
                  size={28}
                  strokeWidth={1.5}
                />
              </IconBox>

              <h2
                className="text-xl font-normal text-zinc-900"
                style={displayFontStyle}
              >
                No analytics yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Add and close some trades to start seeing your trading
                performance.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ============================================================
                PRIMARY STAT CARDS
            ============================================================= */}

            <section className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">

              <StatCard
                title="Net P&L"
                value={fmtSignedMoney(
                  analytics.totalPnl,
                )}
                subtitle={
                  selectedMonth !== "all"
                    ? monthLabel(
                        selectedMonth,
                      )
                    : "All time"
                }
                icon={
                  <CircleDollarSign size={12} />
                }
                positive={pnlPositive}
              />

              <StatCard
                title="Gross Profit"
                value={`+${fmtMoney(
                  analytics.grossProfit,
                )}`}
                subtitle="Total winning volume"
                icon={
                  <TrendingUp size={12} />
                }
                positive={true}
              />

              <StatCard
                title="Gross Loss"
                value={`-${fmtMoney(
                  analytics.grossLoss,
                )}`}
                subtitle="Total losing volume"
                icon={
                  <TrendingDown size={12} />
                }
                positive={false}
              />

              <StatCard
                title="Expectancy"
                value={fmtSignedMoney(
                  analytics.expectancy,
                )}
                subtitle="Average per trade"
                icon={
                  <Target size={12} />
                }
                positive={
                  analytics.expectancy >= 0
                }
              />

              <StatCard
                title="Total Trades"
                value={String(
                  analytics.totalTrades,
                )}
                subtitle="Closed positions"
                icon={
                  <BarChart3 size={12} />
                }
                positive={null}
              />
            </section>

            {/* ============================================================
                SECONDARY STAT CARDS
            ============================================================= */}

            <section className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">

              <StatCard
                title="Win Rate"
                value={fmtPercent(
                  analytics.winRate,
                )}
                subtitle={`${analytics.profits.length} winning trades`}
                icon={
                  <Target size={12} />
                }
                positive={
                  analytics.winRate >= 50
                }
              />

              <StatCard
                title="Profit Factor"
                value={fmtNumber(
                  analytics.profitFactor,
                )}
                subtitle="Gross profit / gross loss"
                icon={
                  <TrendingUp size={12} />
                }
                positive={
                  analytics.profitFactor >= 1
                }
              />

              <StatCard
                title="Average Win"
                value={`+${fmtMoney(
                  analytics.averageWin,
                )}`}
                subtitle="Average profitable trade"
                icon={
                  <TrendingUp size={12} />
                }
                positive={true}
              />

              <StatCard
                title="Average Loss"
                value={`-${fmtMoney(
                  Math.abs(
                    analytics.averageLoss,
                  ),
                )}`}
                subtitle="Average losing trade"
                icon={
                  <TrendingDown size={12} />
                }
                positive={false}
              />
            </section>

            {/* ============================================================
                EQUITY + RESULTS
            ============================================================= */}

            <section className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_0.9fr]">

              {/* Equity Curve */}

              <div
                className={[
                  "rounded-[26px]",
                  "border border-zinc-300/70",
                  "bg-[#eef1f5] p-5 sm:p-6",
                  neutralShadow,
                ].join(" ")}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2
                      className="text-[17px] text-zinc-900"
                      style={displayFontStyle}
                    >
                      Equity Curve
                    </h2>

                    <p className="mt-1 text-[10px] text-zinc-400">
                      Cumulative net P&L across your trades
                    </p>
                  </div>

                  <IconBox className="h-10 w-10 text-zinc-500">
                    <BarChart3 size={16} />
                  </IconBox>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart data={equityData}>
                      <defs>
                        <linearGradient
                          id="equityGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={
                              pnlPositive
                                ? PROFIT_BRIGHT
                                : LOSS_BRIGHT
                            }
                            stopOpacity={0.25}
                          />

                          <stop
                            offset="100%"
                            stopColor={
                              pnlPositive
                                ? PROFIT_BRIGHT
                                : LOSS_BRIGHT
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#dde1e8"
                        strokeDasharray="4 4"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="index"
                        tick={{
                          fontSize: 11,
                          fill: "#a1a1aa",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: "#a1a1aa",
                        }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                      />

                      <Tooltip
                        content={
                          <ChartTooltip />
                        }
                      />

                      <Area
                        type="monotone"
                        dataKey="equity"
                        name="Equity"
                        stroke={
                          pnlPositive
                            ? PROFIT_COLOR
                            : LOSS_COLOR
                        }
                        strokeWidth={2.5}
                        fill="url(#equityGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trade Results */}

              <div
                className={[
                  "rounded-[26px]",
                  "border border-zinc-300/70",
                  "bg-[#eef1f5] p-5 sm:p-6",
                  neutralShadow,
                ].join(" ")}
              >
                <h2
                  className="text-[17px] text-zinc-900"
                  style={displayFontStyle}
                >
                  Trade Results
                </h2>

                <p className="mt-1 text-[10px] text-zinc-400">
                  Win, loss and breakeven distribution
                </p>

                <div className="relative mt-4 h-[190px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={winLossData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {winLossData.map(
                          (entry, index) => (
                            <Cell
                              key={index}
                              fill={entry.color}
                            />
                          ),
                        )}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-2xl text-zinc-800"
                      style={numberFontStyle}
                    >
                      {analytics.totalTrades}
                    </span>

                    <span className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                      Trades
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">

                  {/* Wins */}

                  <div
                    className={[
                      "rounded-2xl",
                      "border border-zinc-300/70",
                      "bg-[#eef1f5] p-3 text-center",
                      "transition-all duration-300",
                      "hover:border-green-600/30",
                      profitShadow,
                    ].join(" ")}
                  >
                    <IconBox className="mx-auto mb-2 h-8 w-8 text-green-700">
                      <Trophy size={14} />
                    </IconBox>

                    <p
                      className="text-[15px]"
                      style={{
                        ...numberFontStyle,
                        color: PROFIT_COLOR,
                      }}
                    >
                      {analytics.profits.length}
                    </p>

                    <p className="mt-1 text-[8px] uppercase tracking-[0.08em] text-zinc-400">
                      Wins
                    </p>

                    <p className="text-[8px] text-zinc-400">
                      {fmtPercent(
                        winPercent,
                      )}
                    </p>
                  </div>

                  {/* Losses */}

                  <div
                    className={[
                      "rounded-2xl",
                      "border border-zinc-300/70",
                      "bg-[#eef1f5] p-3 text-center",
                      "transition-all duration-300",
                      "hover:border-red-600/30",
                      lossShadow,
                    ].join(" ")}
                  >
                    <IconBox className="mx-auto mb-2 h-8 w-8 text-red-700">
                      <TrendingDown size={14} />
                    </IconBox>

                    <p
                      className="text-[15px]"
                      style={{
                        ...numberFontStyle,
                        color: LOSS_COLOR,
                      }}
                    >
                      {analytics.losses.length}
                    </p>

                    <p className="mt-1 text-[8px] uppercase tracking-[0.08em] text-zinc-400">
                      Losses
                    </p>

                    <p className="text-[8px] text-zinc-400">
                      {fmtPercent(
                        lossPercent,
                      )}
                    </p>
                  </div>

                  {/* Breakeven */}

                  <div
                    className={[
                      "rounded-2xl",
                      "border border-zinc-300/70",
                      "bg-[#eef1f5] p-3 text-center",
                      neutralShadow,
                    ].join(" ")}
                  >
                    <IconBox className="mx-auto mb-2 h-8 w-8 text-zinc-500">
                      <Minus size={14} />
                    </IconBox>

                    <p
                      className="text-[15px] text-zinc-700"
                      style={numberFontStyle}
                    >
                      {analytics.breakeven.length}
                    </p>

                    <p className="mt-1 text-[8px] uppercase tracking-[0.08em] text-zinc-400">
                      Breakeven
                    </p>

                    <p className="text-[8px] text-zinc-400">
                      {fmtPercent(
                        breakevenPercent,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================
                TRADING CALENDAR
            ============================================================= */}

            <section className="mb-5">
              <div
                className={[
                  "rounded-[26px]",
                  "border border-zinc-300/70",
                  "bg-[#eef1f5] p-1",
                  neutralShadow,
                ].join(" ")}
              >
                <div className="px-5 py-5 sm:px-7">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">
                      <IconBox className="h-10 w-10 text-zinc-500">
                        <CalendarDays size={17} />
                      </IconBox>

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
                          !hasPreviousCalendarMonth
                        }
                        onClick={() =>
                          changeCalendarMonth(1)
                        }
                        className={[
                          "flex h-9 w-9 items-center justify-center",
                          "rounded-xl border border-zinc-300/70",
                          "bg-[#eef1f5] text-zinc-500",
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
                          "min-w-[155px] rounded-xl",
                          "border border-zinc-300/70",
                          "bg-[#eef1f5] px-4 py-2",
                          "text-center text-[11px]",
                          "uppercase tracking-[0.1em] text-zinc-600",
                          insetShadow,
                        ].join(" ")}
                      >
                        {calendarMonth
                          ? monthLabel(
                              calendarMonth,
                            )
                          : "—"}
                      </div>

                      <button
                        type="button"
                        disabled={
                          !hasNextCalendarMonth
                        }
                        onClick={() =>
                          changeCalendarMonth(-1)
                        }
                        className={[
                          "flex h-9 w-9 items-center justify-center",
                          "rounded-xl border border-zinc-300/70",
                          "bg-[#eef1f5] text-zinc-500",
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

                  {/* Calendar stats */}

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                    <div
                      className={[
                        "rounded-2xl",
                        "border border-zinc-300/70",
                        "bg-[#eef1f5] p-4",
                        "transition-all duration-300",
                        calendarStats.pnl >= 0
                          ? "hover:border-green-600/30"
                          : "hover:border-red-600/30",
                        calendarStats.pnl >= 0
                          ? profitShadow
                          : lossShadow,
                      ].join(" ")}
                    >
                      <p className="text-[8px] uppercase tracking-[0.1em] text-zinc-400">
                        Monthly Net P&L
                      </p>

                      <p
                        className="mt-2 text-[16px]"
                        style={{
                          ...numberFontStyle,
                          color:
                            calendarStats.pnl >= 0
                              ? PROFIT_COLOR
                              : LOSS_COLOR,
                        }}
                      >
                        {fmtSignedMoney(
                          calendarStats.pnl,
                        )}
                      </p>
                    </div>

                    <div
                      className={[
                        "rounded-2xl",
                        "border border-zinc-300/70",
                        "bg-[#eef1f5] p-4",
                        neutralShadow,
                      ].join(" ")}
                    >
                      <p className="text-[8px] uppercase tracking-[0.1em] text-zinc-400">
                        Trades
                      </p>

                      <p
                        className="mt-2 text-[16px] text-zinc-700"
                        style={numberFontStyle}
                      >
                        {calendarStats.trades}
                      </p>
                    </div>

                    <div
                      className={[
                        "rounded-2xl",
                        "border border-zinc-300/70",
                        "bg-[#eef1f5] p-4",
                        neutralShadow,
                      ].join(" ")}
                    >
                      <p className="text-[8px] uppercase tracking-[0.1em] text-zinc-400">
                        Win Rate
                      </p>

                      <p
                        className="mt-2 text-[16px] text-zinc-700"
                        style={numberFontStyle}
                      >
                        {fmtPercent(
                          calendarStats.winRate,
                        )}
                      </p>
                    </div>

                    <div
                      className={[
                        "rounded-2xl",
                        "border border-zinc-300/70",
                        "bg-[#eef1f5] p-4",
                        neutralShadow,
                      ].join(" ")}
                    >
                      <p className="text-[8px] uppercase tracking-[0.1em] text-zinc-400">
                        Wins / Losses
                      </p>

                      <p
                        className="mt-2 text-[16px] text-zinc-700"
                        style={numberFontStyle}
                      >
                        {calendarStats.wins} /{" "}
                        {calendarStats.losses}
                      </p>
                    </div>
                  </div>

                  {/* Calendar */}

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
                      ].map(
                        (day) => (
                          <div
                            key={day}
                            className="py-1 text-center text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                          >
                            {day}
                          </div>
                        ),
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {calendarData.cells.map(
                        (
                          cell,
                          index,
                        ) => (
                          <CalendarDay
                            key={`${calendarMonth}-${index}`}
                            day={cell.day}
                            pnl={cell.pnl}
                            trades={
                              cell.trades
                            }
                            isToday={
                              cell.isToday
                            }
                          />
                        ),
                      )}
                    </div>

                    {/* Legend */}

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
            </section>

            {/* ============================================================
                BEST / WORST
            ============================================================= */}

            <section className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Best */}

              <div
                className={[
                  "rounded-[22px]",
                  "border border-zinc-300/70",
                  "bg-[#eef1f5] p-5",
                  "transition-all duration-300 hover:-translate-y-1",
                  "hover:border-green-600/30",
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
                      {analytics.bestTrade?.symbol ??
                        "—"}
                    </p>
                  </div>

                  <IconBox className="h-10 w-10 text-green-700">
                    <Trophy size={17} />
                  </IconBox>
                </div>

                {analytics.bestTrade && (
                  <div className="flex items-end justify-between">
                    <p className="text-[9px] text-zinc-400">
                      {formatDate(
                        analytics.bestTrade
                          .exit_time,
                      )}
                    </p>

                    <span
                      className="text-[16px]"
                      style={{
                        ...numberFontStyle,
                        color: PROFIT_COLOR,
                      }}
                    >
                      {fmtSignedMoney(
                        getNetPnl(
                          analytics.bestTrade,
                        ),
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Worst */}

              <div
                className={[
                  "rounded-[22px]",
                  "border border-zinc-300/70",
                  "bg-[#eef1f5] p-5",
                  "transition-all duration-300 hover:-translate-y-1",
                  "hover:border-red-600/30",
                  lossShadow,
                ].join(" ")}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                      Worst Trade
                    </p>

                    <p
                      className="mt-1.5 text-lg text-zinc-900"
                      style={displayFontStyle}
                    >
                      {analytics.worstTrade?.symbol ??
                        "—"}
                    </p>
                  </div>

                  <IconBox className="h-10 w-10 text-red-700">
                    <TrendingDown size={17} />
                  </IconBox>
                </div>

                {analytics.worstTrade && (
                  <div className="flex items-end justify-between">
                    <p className="text-[9px] text-zinc-400">
                      {formatDate(
                        analytics.worstTrade
                          .exit_time,
                      )}
                    </p>

                    <span
                      className="text-[16px]"
                      style={{
                        ...numberFontStyle,
                        color: LOSS_COLOR,
                      }}
                    >
                      {fmtSignedMoney(
                        getNetPnl(
                          analytics.worstTrade,
                        ),
                      )}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* ============================================================
                DIRECTION PERFORMANCE
            ============================================================= */}

            <section className="mb-5">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2
                    className="text-[17px] text-zinc-900"
                    style={displayFontStyle}
                  >
                    Direction Performance
                  </h2>

                  <p className="mt-1 text-[10px] text-zinc-400">
                    Compare your long and short performance
                  </p>
                </div>
              </div>

              {directionData.length === 0 ? (
                <div
                  className={[
                    "flex h-[160px] items-center justify-center",
                    "rounded-[22px]",
                    "border border-zinc-300/70",
                    "bg-[#eef1f5]",
                    insetShadow,
                  ].join(" ")}
                >
                  <p className="text-sm text-zinc-400">
                    No direction data available.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                  {directionData.map(
                    (item) => {
                      const positive =
                        item.pnl >= 0;

                      const DirectionIcon =
                        item.direction ===
                        "LONG"
                          ? TrendingUp
                          : item.direction ===
                              "SHORT"
                            ? TrendingDown
                            : BarChart3;

                      return (
                        <div
                          key={
                            item.direction
                          }
                          className={[
                            "group relative overflow-hidden",
                            "rounded-[24px]",
                            "border border-zinc-300/70",
                            "bg-[#eef1f5] p-6",
                            "transition-all duration-300 hover:-translate-y-1",
                            positive
                              ? "hover:border-green-600/30"
                              : "hover:border-red-600/30",
                            positive
                              ? profitShadow
                              : lossShadow,
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between">

                            <IconBox
                              className={[
                                "h-12 w-12 rounded-2xl",
                                positive
                                  ? "text-green-700"
                                  : "text-red-700",
                              ].join(" ")}
                            >
                              <DirectionIcon
                                size={20}
                              />
                            </IconBox>

                            <span className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                              {item.trades}{" "}
                              {item.trades ===
                              1
                                ? "trade"
                                : "trades"}
                            </span>
                          </div>

                          <p
                            className="mt-5 text-[20px] text-zinc-900"
                            style={
                              displayFontStyle
                            }
                          >
                            {
                              item.direction
                            }
                          </p>

                          <p
                            className="mt-1 text-[28px] font-medium tracking-tight"
                            style={{
                              ...numberFontStyle,
                              color:
                                positive
                                  ? PROFIT_COLOR
                                  : LOSS_COLOR,
                            }}
                          >
                            {fmtSignedMoney(
                              item.pnl,
                            )}
                          </p>

                          <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-[0.1em] text-zinc-400">
                              <span>
                                Win rate
                              </span>

                              <span>
                                {fmtPercent(
                                  item.winRate,
                                )}
                              </span>
                            </div>

                            <div
                              className={[
                                "h-1.5 overflow-hidden rounded-full",
                                "bg-[#e6e9ee]",
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
                                      item.winRate,
                                      4,
                                    ),
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          <p className="mt-4 text-[10px] text-zinc-400">
                            Avg{" "}
                            {fmtSignedMoney(
                              item.avg,
                            )}{" "}
                            per trade ·{" "}
                            {item.wins}{" "}
                            wins
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </section>

            {/* ============================================================
                SETUP PERFORMANCE
            ============================================================= */}

            <section>
              <div
                className={[
                  "rounded-[26px]",
                  "border border-zinc-300/70",
                  "bg-[#eef1f5] p-6",
                  neutralShadow,
                ].join(" ")}
              >
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                  <div>
                    <h2
                      className="text-[17px] text-zinc-900"
                      style={displayFontStyle}
                    >
                      Setup Performance
                    </h2>

                    <p className="mt-1 text-[10px] text-zinc-400">
                      Discover which trading setups perform best
                    </p>
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">
                    Top{" "}
                    {setupData.length}{" "}
                    Setups
                  </span>
                </div>

                {setupData.length === 0 ? (
                  <div
                    className={[
                      "flex h-[180px] items-center justify-center",
                      "rounded-2xl",
                      "border border-zinc-300/70",
                      "bg-[#eef1f5]",
                      insetShadow,
                    ].join(" ")}
                  >
                    <p className="text-sm text-zinc-400">
                      No setup data yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {setupData.map(
                      (setup) => {
                        const positive =
                          setup.pnl >= 0;

                        return (
                          <div
                            key={
                              setup.setup
                            }
                            className={[
                              "rounded-2xl",
                              "border border-zinc-300/70",
                              "bg-[#eef1f5] p-4",
                              "transition-all duration-300 hover:-translate-y-1",
                              positive
                                ? "hover:border-green-600/10"
                                : "hover:border-red-600/10",
                              positive
                                ? profitShadow
                                : lossShadow,
                            ].join(" ")}
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">

                              <span className="truncate text-[12px] text-zinc-600">
                                {
                                  setup.setup
                                }
                              </span>

                              <span
                                className="text-[11px]"
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
                                "bg-[#e6e9ee]",
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
                                {
                                  setup.trades
                                }{" "}
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
          </>
        )}
      </div>
    </main>
  );
}