
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  Gauge,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  StickyNote,
} from "lucide-react";

import { getTrades, type Trade } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Fonts, colors, and shadows                                                 */
/* -------------------------------------------------------------------------- */

const FONT_DISPLAY = '"Space Grotesk", "Avenir Next", "Segoe UI", sans-serif';
const FONT_NUMBERS = '"Inter", "SF Pro Display", "Segoe UI", Arial, sans-serif';

const displayFontStyle = {
  fontFamily: FONT_DISPLAY,
  letterSpacing: "0.055em",
  fontWeight: 650,
} as const;

const numberFontStyle = {
  fontFamily: FONT_NUMBERS,
  letterSpacing: "0.045em",
  fontVariantNumeric: "tabular-nums",
} as const;

const PROFIT_COLOR = "#4ade80";
const LOSS_COLOR = "#fb7185";
const SURFACE = "#15122a";

const neutralShadow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(167,139,250,0.22),0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),inset_0_-8px_18px_rgba(5,3,18,0.35),0_0_0_1px_rgba(196,181,253,0.75),0_0_22px_rgba(139,92,246,0.24)]";

const profitShadow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(167,139,250,0.22),0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),inset_0_-8px_18px_rgba(5,3,18,0.35),0_0_0_1px_rgba(196,181,253,0.75),0_0_22px_rgba(139,92,246,0.24)]";

const insetShadow =
  "shadow-[inset_0_2px_5px_rgba(255,255,255,0.09),inset_0_-8px_18px_rgba(6,3,22,0.48),inset_0_0_22px_rgba(139,92,246,0.16)]";

/* -------------------------------------------------------------------------- */
/* Reusable neumorphic dropdown                                               */
/* -------------------------------------------------------------------------- */

type SelectorOption = {
  value: string;
  label: string;
};

function NeumorphicSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectorOption[];
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`relative min-w-0 ${className}`}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          "flex h-10 w-full min-w-0 items-center justify-between gap-3",
          "rounded-xl border border-violet-300/50 bg-[#121026] px-3.5",
          "text-left transition-all duration-200",
          "shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_8px_20px_rgba(0,0,0,0.35)]",
          "hover:border-violet-300/75 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.55),0_0_18px_rgba(139,92,246,0.18)]",
          "active:shadow-[inset_0_0_14px_rgba(139,92,246,0.18)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400/80",
        ].join(" ")}
      >
        <span className="min-w-0 truncate text-[10px] text-violet-100">
          {selectedOption?.label ?? "Select period"}
        </span>

        <ChevronRight
          size={13}
          className={[
            "shrink-0 text-violet-300/85 transition-transform duration-200",
            open ? "-rotate-90" : "rotate-90",
          ].join(" ")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={[
            "absolute right-0 top-[calc(100%+9px)] z-[100]",
            "max-h-64 min-w-full overflow-y-auto",
            "rounded-xl border border-violet-300/55 bg-[#121026] p-2",
            "shadow-[0_16px_45px_rgba(0,0,0,0.65),0_0_0_1px_rgba(167,139,250,0.35)]",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          ].join(" ")}
        >
          <div className="flex flex-col gap-1">
            {options.map((option) => {
              const selected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-4",
                    "whitespace-nowrap rounded-lg px-3 py-2.5 text-left",
                    "text-[10px] transition-all duration-200",
                    selected
                      ? "border border-violet-300/50 bg-[#121026] text-violet-50 shadow-[inset_0_0_14px_rgba(139,92,246,0.14)]"
                      : "border border-transparent text-violet-200 hover:border-violet-400/30 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_0_12px_rgba(139,92,246,0.10)]",
                  ].join(" ")}
                >
                  <span>{option.label}</span>

                  {selected && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-700" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* P&L helpers                                                                */
/* -------------------------------------------------------------------------- */

function pnlHoverBorder(positive: boolean) {
  return positive
    ? "border-violet-300/50 hover:border-green-400/50"
    : "border-violet-300/50 hover:border-red-400/50";
}

function pnlShadow(_positive: boolean) {
  return profitShadow;
}

function pnlTextColor(positive: boolean) {
  return positive ? PROFIT_COLOR : LOSS_COLOR;
}

function pnlIconColor(positive: boolean) {
  return positive ? "text-green-400" : "text-rose-400";
}

/* -------------------------------------------------------------------------- */
/* Data helpers                                                               */
/* -------------------------------------------------------------------------- */

function toNum(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getNetPnl(trade: Trade): number {
  return toNum(trade.pnl) - toNum(trade.fees);
}

function isClosedTrade(trade: Trade): boolean {
  return (
    trade.exit_time !== null &&
    trade.exit_time !== undefined &&
    trade.exit_price !== null &&
    trade.exit_price !== undefined
  );
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
  if (Number.isNaN(date.getTime())) return "unknown";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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
  if (Number.isNaN(date.getTime())) return "unknown";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getMonthDate(key: string): Date | null {
  if (key === "unknown") return null;

  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return null;

  return new Date(year, month - 1, 1);
}

function sortTradesNewestFirst(trades: Trade[]): Trade[] {
  return [...trades].sort(
    (a, b) =>
      new Date(String(b.exit_time)).getTime() -
      new Date(String(a.exit_time)).getTime(),
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable panel                                                             */
/* -------------------------------------------------------------------------- */

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "min-w-0 rounded-[20px] border border-violet-300/50",
        "bg-[#17142d] p-4 sm:p-5",
        neutralShadow,
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && (
          <div
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              "border border-violet-400/30 bg-[#121026] text-violet-300",
              insetShadow,
            ].join(" ")}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h2
            className="truncate text-[16px] text-violet-50"
            style={displayFontStyle}
          >
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-[10px] text-violet-300/85">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat card                                                                  */
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
  icon: ReactNode;
  positive?: boolean;
  valueColor?: string;
}) {
  const isPnlCard = positive !== undefined;
  const accent = valueColor ?? (positive === true ? PROFIT_COLOR : positive === false ? LOSS_COLOR : "#c4b5fd");

  return (
    <div
      className={[
        "group relative flex min-h-[112px] min-w-0 flex-col justify-between overflow-hidden rounded-2xl border",
        "border-violet-400/45 bg-gradient-to-br from-[#20183b] via-[#17132d] to-[#100e20] p-3.5 sm:p-4",
        "shadow-[inset_0_2px_5px_rgba(255,255,255,0.10),inset_0_-12px_22px_rgba(4,2,16,0.58),inset_0_0_20px_rgba(139,92,246,0.17),0_0_0_1px_rgba(167,139,250,0.10)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/80 hover:shadow-[inset_0_2px_6px_rgba(255,255,255,0.12),inset_0_-12px_22px_rgba(4,2,16,0.48),inset_0_0_25px_rgba(139,92,246,0.24),0_0_22px_rgba(139,92,246,0.18)]",
        isPnlCard ? pnlHoverBorder(positive) : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-200/90" style={numberFontStyle}>
          {label}
        </p>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-300/35 bg-[#100d20]"
          style={{ color: accent, boxShadow: "inset 0 2px 5px rgba(255,255,255,.08), inset 0 -5px 12px rgba(0,0,0,.55), 0 0 15px rgba(139,92,246,.14)" }}
        >
          {icon}
        </span>
      </div>

      <p
        className="mt-2 truncate text-[clamp(17px,1.55vw,23px)] font-bold leading-tight tracking-[0.035em]"
        style={{ ...numberFontStyle, color: accent, textShadow: "0 0 18px rgba(167,139,250,.16)" }}
        title={value}
      >
        {value}
      </p>

      <p className="mt-2 truncate text-[9px] font-medium tracking-[0.045em] text-violet-300/90" style={numberFontStyle} title={subtitle}>
        {subtitle}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Calendar day                                                               */
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
  if (!day) return <div className="min-h-[62px] rounded-lg" />;

  const hasTrades = trades > 0;
  const positive = pnl >= 0;

  return (
    <div
      className={[
        "group relative min-h-[62px] min-w-0 rounded-lg border",
        "bg-[#121026] p-1.5 sm:p-2",
        hasTrades ? pnlHoverBorder(positive) : "border-violet-400/30",
        "transition-all duration-200 hover:-translate-y-px",
        hasTrades ? pnlShadow(positive) : neutralShadow,
        isToday ? "ring-1 ring-violet-400/70" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={[
            "flex h-5 w-5 items-center justify-center rounded-md text-[9px]",
            isToday ? "bg-violet-600 text-white" : "text-violet-300",
          ].join(" ")}
          style={numberFontStyle}
        >
          {day}
        </span>

        {hasTrades && (
          <span className="text-[7px] text-violet-300/85" style={numberFontStyle}>
            {trades}T
          </span>
        )}
      </div>

      {hasTrades ? (
        <p
          className="mt-2 truncate text-[9px] sm:text-[10px]"
          style={{
            ...numberFontStyle,
            color: pnlTextColor(positive),
          }}
          title={fmtSignedMoney(pnl)}
        >
          {fmtSignedMoney(pnl)}
        </p>
      ) : (
        <p className="mt-2 text-[8px] text-violet-400/60">—</p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main dashboard                                                             */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // "all" means every closed trade.
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
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

  /* All completed trades */

  const closedTrades = useMemo(
    () => trades.filter(isClosedTrade),
    [trades],
  );

  /* Group closed trades by exit month */

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

  const monthKeys = useMemo(
    () =>
      Object.keys(groupedTrades)
        .filter((key) => key !== "unknown")
        .sort((a, b) => b.localeCompare(a)),
    [groupedTrades],
  );

  useEffect(() => {
    if (selectedMonth !== "all" && !monthKeys.includes(selectedMonth)) {
      setSelectedMonth("all");
    }

  }, [monthKeys, selectedMonth]);

  /* Main dashboard period */

  const dashboardTrades = useMemo(
    () =>
      selectedMonth === "all"
        ? closedTrades
        : groupedTrades[selectedMonth] ?? [],
    [selectedMonth, closedTrades, groupedTrades],
  );

  const periodLabel =
    selectedMonth === "all"
      ? "All Time"
      : monthYearLabel(selectedMonth);

  const dashboardPeriodOptions = useMemo<SelectorOption[]>(
    () => [
      { value: "all", label: "All Time" },
      ...monthKeys.map((key) => ({
        value: key,
        label: monthYearLabel(key),
      })),
    ],
    [monthKeys],
  );

  /* Main metrics */

  const metrics = useMemo(() => {
    let totalPnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    const profits: Trade[] = [];
    const losses: Trade[] = [];

    let bestTrade: Trade | null = null;
    let worstTrade: Trade | null = null;

    for (const trade of dashboardTrades) {
      const pnl = getNetPnl(trade);

      totalPnl += pnl;

      if (pnl > 0) {
        grossProfit += pnl;
        profits.push(trade);
      } else if (pnl < 0) {
        grossLoss += Math.abs(pnl);
        losses.push(trade);
      }

      if (!bestTrade || pnl > getNetPnl(bestTrade)) {
        bestTrade = trade;
      }

      if (!worstTrade || pnl < getNetPnl(worstTrade)) {
        worstTrade = trade;
      }
    }

    const totalTrades = dashboardTrades.length;
    const winRate =
      totalTrades > 0 ? (profits.length / totalTrades) * 100 : 0;

    const profitFactor =
      grossLoss > 0
        ? grossProfit / grossLoss
        : grossProfit > 0
          ? grossProfit
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
      averageTrade: totalTrades > 0 ? totalPnl / totalTrades : 0,
      averageWin: profits.length > 0 ? grossProfit / profits.length : 0,
      averageLoss: losses.length > 0 ? grossLoss / losses.length : 0,
      bestTrade,
      worstTrade,
    };
  }, [dashboardTrades]);

  /* Best and worst trading day */

  const dayStats = useMemo(() => {
    const grouped: Record<string, { pnl: number; trades: number }> = {};

    for (const trade of dashboardTrades) {
      const key = dayKey(trade.exit_time);

      if (!grouped[key]) {
        grouped[key] = { pnl: 0, trades: 0 };
      }

      grouped[key].pnl += getNetPnl(trade);
      grouped[key].trades++;
    }

    const days = Object.entries(grouped).filter(
      ([key]) => key !== "unknown",
    );

    if (days.length === 0) {
      return {
        best: null as [string, { pnl: number; trades: number }] | null,
        worst: null as [string, { pnl: number; trades: number }] | null,
      };
    }

    return {
      best: [...days].sort((a, b) => b[1].pnl - a[1].pnl)[0],
      worst: [...days].sort((a, b) => a[1].pnl - b[1].pnl)[0],
    };
  }, [dashboardTrades]);

  /* Long vs. Short */

  const directionPerformance = useMemo(() => {
    function calculate(direction: "LONG" | "SHORT") {
      const matchingTrades = dashboardTrades.filter(
        (trade) => trade.direction?.toUpperCase() === direction,
      );

      let pnl = 0;
      let wins = 0;
      let grossProfit = 0;
      let grossLoss = 0;

      for (const trade of matchingTrades) {
        const net = getNetPnl(trade);

        pnl += net;

        if (net > 0) {
          wins++;
          grossProfit += net;
        } else if (net < 0) {
          grossLoss += Math.abs(net);
        }
      }

      return {
        direction,
        trades: matchingTrades.length,
        pnl,
        wins,
        losses: matchingTrades.filter(
          (trade) => getNetPnl(trade) < 0,
        ).length,
        winRate:
          matchingTrades.length > 0
            ? (wins / matchingTrades.length) * 100
            : 0,
        profitFactor:
          grossLoss > 0
            ? grossProfit / grossLoss
            : grossProfit > 0
              ? grossProfit
              : 0,
      };
    }

    return {
      long: calculate("LONG"),
      short: calculate("SHORT"),
    };
  }, [dashboardTrades]);

  /* Calendar month */

  const calendarMonth =
    selectedMonth === "all" ? monthKeys[0] ?? null : selectedMonth;

  const calendarTrades = useMemo(
    () => (calendarMonth ? groupedTrades[calendarMonth] ?? [] : []),
    [calendarMonth, groupedTrades],
  );

  const calendarMonthIndex = calendarMonth
    ? monthKeys.indexOf(calendarMonth)
    : -1;

  const hasPreviousMonth =
    calendarMonthIndex >= 0 && calendarMonthIndex < monthKeys.length - 1;

  const hasNextMonth = calendarMonthIndex > 0;

  function changeMonth(direction: -1 | 1) {
    if (calendarMonthIndex < 0) return;

    const nextIndex = calendarMonthIndex + direction;

    if (nextIndex >= 0 && nextIndex < monthKeys.length) {
      setSelectedMonth(monthKeys[nextIndex]);
    }
  }

  /* Calendar data */

  const calendarData = useMemo(() => {
    if (!calendarMonth) {
      return {
        cells: [] as Array<{
          day: number | null;
          pnl: number;
          trades: number;
          isToday: boolean;
        }>,
      };
    }

    const date = getMonthDate(calendarMonth);

    if (!date) {
      return { cells: [] };
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const daily: Record<string, { pnl: number; trades: number }> = {};

    for (const trade of calendarTrades) {
      const key = dayKey(trade.exit_time);

      if (!daily[key]) {
        daily[key] = { pnl: 0, trades: 0 };
      }

      daily[key].pnl += getNetPnl(trade);
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

    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const info = daily[key] ?? { pnl: 0, trades: 0 };

      cells.push({
        day,
        pnl: info.pnl,
        trades: info.trades,
        isToday:
          today.getFullYear() === year &&
          today.getMonth() === month &&
          today.getDate() === day,
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
  }, [calendarMonth, calendarTrades]);

  /* Monthly overview */

  const monthlyOverview = useMemo(
    () =>
      monthKeys.slice(0, 6).map((key) => {
        const monthTrades = groupedTrades[key] ?? [];
        let pnl = 0;
        let wins = 0;

        for (const trade of monthTrades) {
          const tradePnl = getNetPnl(trade);

          pnl += tradePnl;

          if (tradePnl > 0) {
            wins++;
          }
        }

        return {
          key,
          label: shortMonthLabel(key),
          pnl,
          trades: monthTrades.length,
          winRate:
            monthTrades.length > 0
              ? (wins / monthTrades.length) * 100
              : 0,
        };
      }),
    [monthKeys, groupedTrades],
  );

  /* Recent trades */

  const recentTrades = useMemo(
    () => sortTradesNewestFirst(dashboardTrades).slice(0, 5),
    [dashboardTrades],
  );

  /* Setup performance */

  const setupPerformance = useMemo(() => {
    const grouped: Record<
      string,
      { trades: number; pnl: number; wins: number }
    > = {};

    for (const trade of dashboardTrades) {
      const setup = trade.setup?.trim() || "No Setup";

      if (!grouped[setup]) {
        grouped[setup] = { trades: 0, pnl: 0, wins: 0 };
      }

      const pnl = getNetPnl(trade);

      grouped[setup].trades++;
      grouped[setup].pnl += pnl;

      if (pnl > 0) {
        grouped[setup].wins++;
      }
    }

    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        ...data,
        winRate:
          data.trades > 0 ? (data.wins / data.trades) * 100 : 0,
      }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 5);
  }, [dashboardTrades]);

  /* Trade notes */

  const tradesWithNotes = useMemo(
    () => recentTrades.filter((trade) => Boolean(trade.lesson?.trim())),
    [recentTrades],
  );

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                            */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#121026] px-4 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[#121026] ${neutralShadow}`}
            >
              <Loader2 size={22} className="animate-spin text-violet-300" />
            </div>

            <p className="text-xs text-violet-300" style={numberFontStyle}>
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error state                                                              */
  /* ------------------------------------------------------------------------ */

  if (error) {
    return (
      <main className="min-h-screen bg-[#121026] px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1
            className="mb-5 bg-gradient-to-r from-violet-200 via-fuchsia-300 to-violet-400 bg-clip-text text-xl font-bold tracking-[0.08em] text-transparent sm:text-2xl"
            style={displayFontStyle}
          >
            The Millionaire Diary
          </h1>

          <Panel className="p-6 sm:p-8">
            <h2 className="text-xl text-violet-50" style={displayFontStyle}>
              Unable to load dashboard
            </h2>

            <p
              className="mt-3 whitespace-pre-line text-sm text-violet-300"
              style={numberFontStyle}
            >
              {error}
            </p>

            <Link
              href="/trades/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-white transition hover:bg-violet-500"
            >
              Add Trade <ArrowRight size={13} />
            </Link>
          </Panel>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Empty state                                                              */
  /* ------------------------------------------------------------------------ */

  if (closedTrades.length === 0) {
    return (
      <main
        className="min-h-screen bg-[#121026] px-4 py-5 sm:px-6 lg:px-8"
        style={numberFontStyle}
      >
        <div className="mx-auto max-w-[1500px]">
          <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1
              className="bg-gradient-to-r from-violet-200 via-fuchsia-300 to-violet-400 bg-clip-text text-xl font-bold tracking-[0.08em] text-transparent sm:text-2xl"
              style={displayFontStyle}
            >
              The Millionaire Diary
            </h1>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <CalendarDays
                size={14}
                className="shrink-0 text-violet-300/85"
              />

              <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-violet-300/85">
                Period
              </span>

              <NeumorphicSelect
                value={selectedMonth}
                onChange={setSelectedMonth}
                ariaLabel="Dashboard period"
                className="w-[175px]"
                options={dashboardPeriodOptions}
              />
            </div>
          </header>

          <Panel className="flex min-h-[350px] items-center justify-center p-6 sm:min-h-[400px]">
            <div className="max-w-md text-center">
              <div
                className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/30 bg-[#121026] text-violet-300/85 ${insetShadow}`}
              >
                <BarChart3 size={25} strokeWidth={1.5} />
              </div>

              <h2 className="text-xl text-violet-50" style={displayFontStyle}>
                Build your journal
              </h2>

              <p className="mt-2 text-xs leading-5 text-violet-300">
                Record your trades to unlock your P&amp;L calendar, win rate,
                trading setups, notes, and monthly statistics.
              </p>

              <Link
                href="/trades/new"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-5 text-[9px] uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-violet-500"
              >
                + Add Your First Trade
              </Link>
            </div>
          </Panel>
        </div>
      </main>
    );
  }

  const pnlPositive = metrics.totalPnl >= 0;
  const profitFactorPositive = metrics.profitFactor >= 1;

  /* ------------------------------------------------------------------------ */
  /* Dashboard                                                                */
  /* ------------------------------------------------------------------------ */

  return (
    <main
      className="min-h-screen bg-[#121026] px-4 py-5 sm:px-6 lg:px-8"
      style={numberFontStyle}
    >
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}

        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1
            className="bg-gradient-to-r from-violet-200 via-fuchsia-300 to-violet-400 bg-clip-text text-xl font-bold tracking-[0.08em] text-transparent sm:text-2xl"
            style={displayFontStyle}
          >
            The Millionaire Diary
          </h1>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <CalendarDays
              size={14}
              className="shrink-0 text-violet-300/85"
            />

            <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-violet-300/85">
              Period
            </span>

            <NeumorphicSelect
              value={selectedMonth}
              onChange={setSelectedMonth}
              ariaLabel="Dashboard period"
              className="w-[175px]"
              options={dashboardPeriodOptions}
            />
          </div>
        </header>

        {/* Performance overview: all nine statistic cards in one panel */}

        <Panel className="mb-5 p-4 sm:p-5">
          <SectionHeading
            title="Performance Overview"
            subtitle={`Key trading statistics for ${periodLabel.toLowerCase()}`}
            icon={<Gauge size={15} />}
          />

        <section className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Total P&L"
            value={fmtSignedMoney(metrics.totalPnl)}
            subtitle={`${metrics.totalTrades} completed trades`}
            icon={
              pnlPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )
            }
            positive={pnlPositive}
            valueColor={pnlPositive ? PROFIT_COLOR : LOSS_COLOR}
          />

          <StatCard
            label="Win Rate"
            value={fmtPercent(metrics.winRate)}
            subtitle={`${metrics.profits.length} winning trades`}
            icon={<Target size={14} />}
            positive={metrics.winRate >= 50}
            valueColor={metrics.winRate >= 50 ? PROFIT_COLOR : LOSS_COLOR}
          />

          <StatCard
            label="Average Win"
            value={`+${fmtMoney(metrics.averageWin)}`}
            subtitle="Average profitable trade"
            icon={<ArrowUpRight size={14} />}
            positive
            valueColor={PROFIT_COLOR}
          />

          <StatCard
            label="Average Loss"
            value={`-${fmtMoney(metrics.averageLoss)}`}
            subtitle="Average losing trade"
            icon={<ArrowDownRight size={14} />}
            positive={false}
            valueColor={LOSS_COLOR}
          />

          <StatCard
            label="Profit Factor"
            value={metrics.profitFactor.toFixed(2)}
            subtitle={
              profitFactorPositive ? "Profitable edge" : "Needs improvement"
            }
            icon={<Gauge size={14} />}
            positive={profitFactorPositive}
            valueColor={profitFactorPositive ? PROFIT_COLOR : LOSS_COLOR}
          />
        </section>

        {/* Best and worst performance stat cards */}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          <StatCard
            label="Best Trade"
            value={
              metrics.bestTrade
                ? fmtSignedMoney(getNetPnl(metrics.bestTrade))
                : "—"
            }
            subtitle={metrics.bestTrade?.symbol ?? "No trade data"}
            icon={<Trophy size={14} />}
            positive
            valueColor={PROFIT_COLOR}
          />

          <StatCard
            label="Worst Trade"
            value={
              metrics.worstTrade
                ? fmtSignedMoney(getNetPnl(metrics.worstTrade))
                : "—"
            }
            subtitle={metrics.worstTrade?.symbol ?? "No trade data"}
            icon={<TrendingDown size={14} />}
            positive={false}
            valueColor={LOSS_COLOR}
          />

          <StatCard
            label="Best Trading Day"
            value={dayStats.best ? fmtSignedMoney(dayStats.best[1].pnl) : "—"}
            subtitle={dayStats.best ? fmtDate(dayStats.best[0]) : "No day data"}
            icon={<CalendarDays size={14} />}
            positive
            valueColor={PROFIT_COLOR}
          />

          <StatCard
            label="Worst Trading Day"
            value={
              dayStats.worst ? fmtSignedMoney(dayStats.worst[1].pnl) : "—"
            }
            subtitle={
              dayStats.worst ? fmtDate(dayStats.worst[0]) : "No day data"
            }
            icon={<CalendarDays size={14} />}
            positive={false}
            valueColor={LOSS_COLOR}
          />
        </section>
        </Panel>

        {/* Calendar and recent trades */}

        <section className="mb-5 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-5">
          <Panel className="col-span-3 flex h-full min-w-0 flex-col p-3 sm:p-4">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SectionHeading
                title="Trading Calendar"
                subtitle={
                  selectedMonth === "all"
                    ? "Daily P&L for your latest active month"
                    : "Daily realized P&L for the selected month"
                }
                icon={<CalendarDays size={15} />}
              />

              <div className="mb-4 flex items-center gap-1.5 sm:mb-0">
                <button
                  type="button"
                  disabled={!hasPreviousMonth}
                  onClick={() => changeMonth(1)}
                  aria-label="Previous month with trades"
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                    "border-violet-300/50 bg-[#121026] text-violet-300",
                    "transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30",
                    neutralShadow,
                  ].join(" ")}
                >
                  <ChevronLeft size={15} />
                </button>

                <div
                  className={[
                    "min-w-[125px] rounded-lg border border-violet-400/30",
                    "bg-[#121026] px-2.5 py-2 text-center",
                    "text-[9px] uppercase tracking-[0.14em] text-violet-200",
                    insetShadow,
                  ].join(" ")}
                >
                  {calendarMonth ? monthYearLabel(calendarMonth) : "No Month"}
                </div>

                <button
                  type="button"
                  disabled={!hasNextMonth}
                  onClick={() => changeMonth(-1)}
                  aria-label="Next month with trades"
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                    "border-violet-300/50 bg-[#121026] text-violet-300",
                    "transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30",
                    neutralShadow,
                  ].join(" ")}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div className="grid flex-1 grid-rows-[auto_1fr]">
              <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-1 text-center text-[8px] uppercase tracking-[0.14em] text-violet-300/85"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 content-start gap-1.5 sm:gap-2">
                {calendarData.cells.map((cell, index) => (
                  <CalendarDay
                    key={`${calendarMonth}-${index}`}
                    day={cell.day}
                    pnl={cell.pnl}
                    trades={cell.trades}
                    isToday={cell.isToday}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-violet-400/25 pt-3">
              {[
                { label: "Profitable", dot: "bg-green-400" },
                { label: "Losing", dot: "bg-rose-400" },
                { label: "No trades", dot: "bg-zinc-300" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                  <span className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="col-span-2 flex h-full min-w-0 flex-col p-3 sm:p-4">
            <SectionHeading
              title="Recent Trades"
              subtitle={`Latest completed positions · ${periodLabel}`}
              icon={<CalendarDays size={15} />}
              action={
                <Link
                  href="/trades"
                  className="inline-flex shrink-0 items-center gap-1 text-[8px] uppercase tracking-[0.14em] text-violet-300/85 transition hover:text-violet-50"
                >
                  View All <ArrowRight size={11} />
                </Link>
              }
            />

            <div className="flex flex-1 flex-col gap-2">
              {recentTrades.map((trade) => {
                const pnl = getNetPnl(trade);
                const positive = pnl >= 0;

                return (
                  <Link
                    key={trade.id}
                    href={`/trades/${trade.id}`}
                    className={[
                      "group flex min-w-0 flex-1 items-center justify-between gap-3",
                      "rounded-xl border bg-[#121026] px-3 py-2.5",
                      "transition-all duration-300 hover:-translate-y-0.5",
                      pnlHoverBorder(positive),
                      pnlShadow(positive),
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          "border border-violet-400/30 bg-[#121026]",
                          pnlIconColor(positive),
                          insetShadow,
                        ].join(" ")}
                      >
                        {trade.direction?.toUpperCase() === "SHORT" ? (
                          <TrendingDown size={14} />
                        ) : (
                          <TrendingUp size={14} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="truncate text-[12px] text-violet-100"
                          style={displayFontStyle}
                        >
                          {trade.symbol}
                        </p>

                        <p className="mt-1 truncate text-[8px] text-violet-300/85">
                          {trade.direction} <span className="px-1">·</span>
                          {fmtDate(trade.exit_time)}
                          <span className="px-1">·</span>
                          {trade.lots} lots
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className="text-[11px]"
                        style={{
                          ...numberFontStyle,
                          color: pnlTextColor(positive),
                        }}
                      >
                        {fmtSignedMoney(pnl)}
                      </p>

                      <p className="mt-1 text-[8px] text-violet-300/85">
                        Net P&amp;L
                      </p>
                    </div>
                  </Link>
                );
              })}

              {recentTrades.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-violet-400/30 text-xs text-violet-300/85">
                  No completed trades for this period.
                </div>
              )}
            </div>
          </Panel>
        </section>

        {/* Selected-period statistics and monthly performance */}

        <section className="mb-5 grid grid-cols-1 items-start gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                  Selected Period
                </p>

                <h2
                  className="mt-1 text-[18px] text-violet-50"
                  style={displayFontStyle}
                >
                  {periodLabel}
                </h2>
              </div>

              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  "border border-violet-400/30 bg-[#121026]",
                  pnlIconColor(metrics.totalPnl >= 0),
                  insetShadow,
                ].join(" ")}
              >
                {metrics.totalPnl >= 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
              </div>
            </div>

            <div
              className={[
                "rounded-xl border bg-[#121026] p-4",
                "transition-all duration-300 hover:-translate-y-0.5",
                pnlHoverBorder(metrics.totalPnl >= 0),
                pnlShadow(metrics.totalPnl >= 0),
              ].join(" ")}
            >
              <p className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                Net P&amp;L
              </p>

              <p
                className="mt-1.5 text-[25px] font-medium tracking-tight"
                style={{
                  ...numberFontStyle,
                  color: metrics.totalPnl >= 0 ? PROFIT_COLOR : LOSS_COLOR,
                }}
              >
                {fmtSignedMoney(metrics.totalPnl)}
              </p>

              <p className="mt-1 text-[9px] text-violet-300/85">
                {metrics.totalTrades} completed trades
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                {
                  label: "Win Rate",
                  value: fmtPercent(metrics.winRate),
                  color: "#ede9fe",
                },
                {
                  label: "Winning",
                  value: String(metrics.profits.length),
                  color: PROFIT_COLOR,
                },
                {
                  label: "Losing",
                  value: String(metrics.losses.length),
                  color: LOSS_COLOR,
                },
                {
                  label: "Average Trade",
                  value:
                    metrics.totalTrades > 0
                      ? fmtSignedMoney(metrics.averageTrade)
                      : "$0.00",
                  color: metrics.averageTrade >= 0 ? PROFIT_COLOR : LOSS_COLOR,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={[
                    "rounded-lg border border-violet-400/30 bg-[#121026] p-3",
                    neutralShadow,
                  ].join(" ")}
                >
                  <p className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                    {item.label}
                  </p>

                  <p
                    className="mt-1.5 truncate text-[14px]"
                    style={{ ...numberFontStyle, color: item.color }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2
                  className="text-[16px] text-violet-50"
                  style={displayFontStyle}
                >
                  Monthly Performance
                </h2>

                <p className="mt-1 text-[9px] text-violet-300/85">
                  Select a month to filter the dashboard.
                </p>
              </div>

              <Link
                href="/analytics"
                className="shrink-0 text-[8px] uppercase tracking-[0.14em] text-violet-300/85 transition hover:text-violet-50"
              >
                Analytics
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {monthlyOverview.map((month) => {
                const positive = month.pnl >= 0;
                const active = month.key === selectedMonth;

                return (
                  <button
                    key={month.key}
                    type="button"
                    onClick={() => setSelectedMonth(month.key)}
                    className={[
                      "flex min-w-0 items-center justify-between gap-3 rounded-xl border",
                      "bg-[#121026] px-3 py-3 text-left",
                      "transition-all duration-300 hover:-translate-y-0.5",
                      pnlHoverBorder(positive),
                      pnlShadow(positive),
                      active ? "ring-1 ring-violet-400/70" : "",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[10px] text-violet-200">
                        {month.label}
                      </p>

                      <p className="mt-1 text-[8px] text-violet-300/85">
                        {month.trades} trades · {fmtPercent(month.winRate)}
                      </p>
                    </div>

                    <span
                      className="shrink-0 text-[10px]"
                      style={{
                        ...numberFontStyle,
                        color: pnlTextColor(positive),
                      }}
                    >
                      {fmtSignedMoney(month.pnl)}
                    </span>
                  </button>
                );
              })}

              {monthlyOverview.length === 0 && (
                <p className="py-8 text-center text-xs text-violet-300/85 sm:col-span-2">
                  No monthly performance data.
                </p>
              )}
            </div>

            {selectedMonth !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedMonth("all")}
                className="mt-3 text-[8px] uppercase tracking-[0.14em] text-violet-300 transition hover:text-violet-50"
              >
                View All Time
              </button>
            )}
          </Panel>
        </section>

        {/* Long vs. Short performance */}

        <section className="mb-5">
          <Panel className="p-4 sm:p-5">
            <SectionHeading
              title="Long vs. Short Performance"
              subtitle={`Direction comparison for ${periodLabel.toLowerCase()}`}
              icon={<BarChart3 size={15} />}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                {
                  ...directionPerformance.long,
                  title: "Long Positions",
                  icon: <TrendingUp size={16} />,
                  positive: directionPerformance.long.pnl >= 0,
                },
                {
                  ...directionPerformance.short,
                  title: "Short Positions",
                  icon: <TrendingDown size={16} />,
                  positive: directionPerformance.short.pnl >= 0,
                },
              ].map((item) => (
                <div
                  key={item.direction}
                  className={[
                    "min-w-0 rounded-xl border bg-[#121026] p-4",
                    "transition-all duration-300 hover:-translate-y-0.5",
                    pnlHoverBorder(item.positive),
                    pnlShadow(item.positive),
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          "border border-violet-400/30 bg-[#121026]",
                          pnlIconColor(item.positive),
                          insetShadow,
                        ].join(" ")}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="text-[13px] text-violet-100"
                          style={displayFontStyle}
                        >
                          {item.title}
                        </p>

                        <p className="mt-1 text-[8px] text-violet-300/85">
                          {item.trades} trades · {item.wins} wins ·{" "}
                          {item.losses} losses
                        </p>
                      </div>
                    </div>

                    <p
                      className="shrink-0 text-[15px]"
                      style={{
                        ...numberFontStyle,
                        color: pnlTextColor(item.positive),
                      }}
                    >
                      {fmtSignedMoney(item.pnl)}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div
                      className={`rounded-lg border border-violet-400/30 bg-[#121026] p-3 ${insetShadow}`}
                    >
                      <p className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                        Win Rate
                      </p>

                      <p
                        className="mt-1.5 text-[16px]"
                        style={{
                          ...numberFontStyle,
                          color:
                            item.winRate >= 50 ? PROFIT_COLOR : "#52525b",
                        }}
                      >
                        {fmtPercent(item.winRate)}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg border border-violet-400/30 bg-[#121026] p-3 ${insetShadow}`}
                    >
                      <p className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                        Profit Factor
                      </p>

                      <p
                        className="mt-1.5 text-[16px]"
                        style={{
                          ...numberFontStyle,
                          color:
                            item.profitFactor >= 1
                              ? PROFIT_COLOR
                              : LOSS_COLOR,
                        }}
                      >
                        {item.profitFactor.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[8px] text-violet-300/85">
                    <span>Share of selected-period trades</span>

                    <span>
                      {metrics.totalTrades > 0
                        ? fmtPercent(
                            (item.trades / metrics.totalTrades) * 100,
                          )
                        : "0.0%"}
                    </span>
                  </div>

                  <div
                    className={`mt-2 h-1.5 overflow-hidden rounded-full border border-violet-400/25 bg-[#151322] ${insetShadow}`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        item.direction === "LONG"
                          ? "bg-green-400"
                          : "bg-rose-400"
                      }`}
                      style={{
                        width: `${
                          metrics.totalTrades > 0
                            ? (item.trades / metrics.totalTrades) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* Trade notes and setup performance — paired two-column layout */}

        <section className="mb-5 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2">
          <div className="min-w-0">
          <Panel className="p-4">
            <SectionHeading
              title="Trade Notes"
              subtitle="Lessons and observations from your recent trades"
              icon={<StickyNote size={15} />}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {tradesWithNotes.slice(0, 6).map((trade) => (
                <Link
                  key={trade.id}
                  href={`/trades/${trade.id}`}
                  className={[
                    "min-w-0 rounded-xl border border-violet-400/30",
                    "bg-[#121026] p-3.5",
                    "transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/70",
                    neutralShadow,
                  ].join(" ")}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p
                      className="truncate text-[11px] text-violet-100"
                      style={displayFontStyle}
                    >
                      {trade.symbol}
                    </p>

                    <span className="shrink-0 text-[8px] text-violet-300/85">
                      {fmtDate(trade.exit_time)}
                    </span>
                  </div>

                  <p className="line-clamp-3 whitespace-pre-wrap break-words text-[10px] leading-5 text-violet-300">
                    {trade.lesson}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-violet-400/25 pt-2">
                    <span className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                      {trade.setup?.trim() || "No setup"}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[8px] text-violet-300/85">
                      View trade <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              ))}

              {tradesWithNotes.length === 0 && (
                <div
                  className={[
                    "rounded-xl border border-violet-400/30 bg-[#121026]",
                    "px-4 py-8 text-center md:col-span-2 xl:col-span-3",
                    insetShadow,
                  ].join(" ")}
                >
                  <StickyNote
                    size={20}
                    className="mx-auto mb-2 text-violet-400/60"
                  />

                  <p className="text-xs text-violet-300">
                    No trade notes for this period
                  </p>

                  <p className="mt-1 text-[9px] text-violet-300/85">
                    Add notes or lessons when recording a trade to see them
                    here.
                  </p>

                  <Link
                    href="/trades"
                    className="mt-3 inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-violet-300 hover:text-violet-50"
                  >
                    Browse trades <ArrowRight size={11} />
                  </Link>
                </div>
              )}
            </div>
          </Panel>
          </div>

          {/* Setup performance */}
          <div className="min-w-0">
          <Panel className="p-4">
            <SectionHeading
              title="Setup Performance"
              subtitle={`Your strongest recorded setups · ${periodLabel}`}
              icon={<FileText size={15} />}
            />

            {setupPerformance.length === 0 ? (
              <div
                className={`flex min-h-[120px] items-center justify-center rounded-xl border border-violet-400/30 bg-[#121026] text-xs text-violet-300/85 ${insetShadow}`}
              >
                No setup data for this period
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {setupPerformance.map((setup) => {
                  const positive = setup.pnl >= 0;

                  return (
                    <div
                      key={setup.name}
                      className={[
                        "rounded-xl border bg-[#121026] p-3",
                        "transition-all duration-300 hover:-translate-y-px",
                        pnlHoverBorder(positive),
                        pnlShadow(positive),
                      ].join(" ")}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="truncate text-[10px] text-violet-200">
                          {setup.name}
                        </span>

                        <span
                          className="shrink-0 text-[10px]"
                          style={{
                            ...numberFontStyle,
                            color: pnlTextColor(positive),
                          }}
                        >
                          {fmtSignedMoney(setup.pnl)}
                        </span>
                      </div>

                      <div
                        className={`h-1.5 overflow-hidden rounded-full border border-violet-400/25 bg-[#151322] ${insetShadow}`}
                      >
                        <div
                          className={`h-full rounded-full ${
                            positive ? "bg-green-400" : "bg-rose-400"
                          }`}
                          style={{
                            width: `${Math.min(
                              Math.max(setup.winRate, 5),
                              100,
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex justify-between gap-2 text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                        <span>{setup.trades} trades</span>
                        <span>{fmtPercent(setup.winRate)} win rate</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
          </div>
        </section>

        {/* Footer */}

        <section className="pb-5">
          <div
            className={[
              "flex flex-col gap-3 rounded-[18px] border border-violet-300/50",
              "bg-[#121026] px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
              neutralShadow,
            ].join(" ")}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  "border border-violet-400/30 bg-[#121026] text-violet-300",
                  insetShadow,
                ].join(" ")}
              >
                <Wallet size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] uppercase tracking-[0.14em] text-violet-300/85">
                  Journal Status
                </p>

                <p className="mt-1 text-[10px] text-violet-200">
                  Showing{" "}
                  <span className="text-violet-50">
                    {metrics.totalTrades} completed trades
                  </span>{" "}
                  for {periodLabel}.
                </p>
              </div>
            </div>

            <Link
              href="/trades"
              className="inline-flex shrink-0 items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-violet-300 transition hover:text-violet-50"
            >
              Review Journal <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
