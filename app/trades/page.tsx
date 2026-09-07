"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Eye,
  FileText,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { getTrades, deleteTrade, type Trade } from "@/lib/api";

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
/* P&L Colors                                                                 */
/* -------------------------------------------------------------------------- */

const PROFIT_COLOR = "#15803d";
const LOSS_COLOR = "#b91c1c";

/* -------------------------------------------------------------------------- */
/* Neumorphism Shadows                                                        */
/* -------------------------------------------------------------------------- */

/*
 * Neutral shadow:
 * Used at rest across the page.
 */
const neutralShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_25px_rgba(163,177,198,0.30),-10px_-10px_25px_rgba(255,255,255,1)]";

/*
 * Inset neumorphic shadow.
 */
const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.18),inset_-5px_-5px_12px_rgba(255,255,255,0.90)]";

/*
 * P&L shadow:
 *
 * DEFAULT:
 * - Completely neutral.
 * - No green/red glow.
 *
 * HOVER:
 * - Stronger neumorphic shadow.
 * - P&L-specific colored glow.
 */
const profitShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_26px_rgba(163,177,198,0.26),-10px_-10px_26px_rgba(255,255,255,1)]";

const lossShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_26px_rgba(163,177,198,0.26),-10px_-10px_26px_rgba(255,255,255,1)]";

/*
 * P&L border:
 *
 * DEFAULT:
 * neutral zinc border.
 *
 * HOVER:
 * P&L color becomes visible.
 */
const profitBorder =
  "border border-zinc-300/70 hover:border-green-600/10";

const lossBorder =
  "border border-zinc-300/70 hover:border-red-600/10";

/* -------------------------------------------------------------------------- */
/* Table Grid                                                                 */
/* -------------------------------------------------------------------------- */

const GRID_TEMPLATE =
  "minmax(150px,1.6fr) minmax(100px,1.1fr) minmax(100px,1.1fr) minmax(90px,1fr) minmax(56px,0.55fr) minmax(140px,1.5fr) minmax(150px,1.6fr) minmax(56px,0.6fr) minmax(80px,0.8fr)";

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

function monthKey(value: unknown): string {
  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
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

function shortMonthYearLabel(key: string): string {
  if (key === "unknown") return "Unknown";

  const [year, month] = key.split("-").map(Number);

  if (!year || !month) return "Unknown";

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function fmtPrice(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const n = toNum(value);

  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtMoney(value: unknown): string {
  const n = Math.abs(toNum(value));

  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtSignedMoney(value: number): string {
  return `${value >= 0 ? "+" : "-"}${fmtMoney(value)}`;
}

function fmtDate(value: unknown): string {
  if (!value) return "—";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(value: unknown): string {
  if (!value) return "—";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* -------------------------------------------------------------------------- */
/* Small UI Components                                                        */
/* -------------------------------------------------------------------------- */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500"
      style={numberFontStyle}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Trade Row Card                                                             */
/* -------------------------------------------------------------------------- */

function TradeRowCard({
  trade,
  onDelete,
}: {
  trade: Trade;
  onDelete: (id: number) => void;
}) {
  const profit = getNetPnl(trade);
  const isProfit = profit >= 0;

  const pnlColor = isProfit ? PROFIT_COLOR : LOSS_COLOR;

  const directionText = String(trade.direction ?? "");
  const directionLower = directionText.toLowerCase();

  const isBuy =
    directionLower.includes("buy") || directionLower.includes("long");

  const pnlBorder = isProfit ? profitBorder : lossBorder;
  const pnlShadow = isProfit ? profitShadow : lossShadow;

  return (
    <div
      className={[
        "group grid items-center gap-3 rounded-2xl",
        "bg-[#eef1f5]",
        "px-4 py-5 sm:px-5 sm:py-5.5",
        "transition-[border-color,box-shadow] duration-300 ease-in-out",
        "transition-all duration-300 hover:-translate-y-1",
        pnlBorder,
        pnlShadow,
      ].join(" ")}
      style={{
        ...numberFontStyle,
        gridTemplateColumns: GRID_TEMPLATE,
      }}
    >
      {/* ==================================================================== */}
      {/* SYMBOL + DIRECTION                                                   */}
      {/* ==================================================================== */}

      <Link
        href={`/trades/${trade.id}`}
        className="flex min-w-0 items-center gap-3 outline-none"
      >
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            "bg-[#eef1f5]",
            isProfit ? "text-green-700" : "text-red-700",
            insetShadow,
          ].join(" ")}
        >
          {directionText.slice(0, 1) || "—"}
        </div>

        <div className="min-w-0">
          <div
            className={[
              "truncate text-[15px] font-normal",
              "transition-colors duration-300",
            ].join(" ")}
            style={{
              ...displayFontStyle,
              color: pnlColor,
            }}
          >
            {trade.symbol}
          </div>

          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={[
                "inline-flex rounded-md px-1.5 py-0.5",
                "bg-[#eef1f5]",
                "text-[8px] uppercase tracking-[0.08em]",
                insetShadow,
              ].join(" ")}
              style={{
                color: isBuy ? PROFIT_COLOR : LOSS_COLOR,
              }}
            >
              {trade.direction}
            </span>

            <span className="text-[8px] text-zinc-400">
              #{trade.id}
            </span>
          </div>
        </div>
      </Link>

      {/* ==================================================================== */}
      {/* ENTRY                                                                 */}
      {/* ==================================================================== */}

      <div className="min-w-0">
        <div className="truncate text-[11px] text-zinc-800 sm:text-[12px]">
          ${fmtPrice(trade.entry_price)}
        </div>

        <div className="mt-1 truncate text-[8px] text-zinc-400">
          {fmtDate(trade.entry_time)}
        </div>

        <div className="mt-0.5 truncate text-[8px] text-zinc-400">
          {fmtTime(trade.entry_time)}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* EXIT                                                                  */}
      {/* ==================================================================== */}

      <div className="min-w-0">
        <div className="truncate text-[11px] text-zinc-800 sm:text-[12px]">
          ${fmtPrice(trade.exit_price)}
        </div>

        <div className="mt-1 truncate text-[8px] text-zinc-400">
          {fmtDate(trade.exit_time)}
        </div>

        <div className="mt-0.5 truncate text-[8px] text-zinc-400">
          {fmtTime(trade.exit_time)}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* P&L                                                                   */}
      {/* ==================================================================== */}

      <div className="min-w-0">
        <div
          className={[
            "inline-flex max-w-full items-center justify-center",
            "rounded-lg bg-[#eef1f5] px-2 py-1.5",
            "text-[10px] font-medium sm:text-[11px]",
            "border border-zinc-300/70",
            "transition-[border-color,box-shadow] duration-300",
            isProfit
              ? "hover:border-green-600/70"
              : "hover:border-red-600/70",
            isProfit
              ? "hover:shadow-[0_0_12px_rgba(21,128,61,0.45),0_4px_16px_rgba(21,128,61,0.30)]"
              : "hover:shadow-[0_0_12px_rgba(185,28,28,0.45),0_4px_16px_rgba(185,28,28,0.30)]",
          ].join(" ")}
          style={{ color: pnlColor }}
        >
          <span className="truncate">
            {fmtSignedMoney(profit)}
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* LOTS                                                                  */}
      {/* ==================================================================== */}

      <div className="text-center text-[11px] text-zinc-700 sm:text-xs">
        {trade.lots}
      </div>

      {/* ==================================================================== */}
      {/* SETUP                                                                 */}
      {/* ==================================================================== */}

      <div
        className="line-clamp-2 min-w-0 break-words text-[10px] leading-4 text-zinc-600 sm:text-[11px]"
        title={trade.setup || undefined}
      >
        {trade.setup?.trim() || "—"}
      </div>

      {/* ==================================================================== */}
      {/* NOTES                                                                 */}
      {/* ==================================================================== */}

      <div className="flex min-w-0 items-start gap-1.5">
        <FileText
          size={12}
          className={[
            "mt-0.5 shrink-0 text-zinc-300",
            "transition-colors duration-300",
            isProfit
              ? "group-hover:text-green-600"
              : "group-hover:text-red-600",
          ].join(" ")}
        />

        <p
          className="line-clamp-2 min-w-0 break-words text-[10px] leading-4 text-zinc-600 sm:text-[11px]"
          title={trade.lesson || undefined}
        >
          {trade.lesson?.trim() || "—"}
        </p>
      </div>

      {/* ==================================================================== */}
      {/* SCORE                                                                 */}
      {/* ==================================================================== */}

      <div className="flex justify-center">
        <div
          className={[
            "flex h-8 min-w-[34px] max-w-[44px]",
            "items-center justify-center rounded-lg bg-[#eef1f5]",
            insetShadow,
          ].join(" ")}
        >
          <span className="text-[9px] text-zinc-700">
            {trade.score !== null && trade.score !== undefined
              ? `${trade.score}/10`
              : "—"}
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ACTIONS                                                               */}
      {/* ==================================================================== */}

      <div className="flex items-center justify-end gap-1.5">
        <Link
          href={`/trades/${trade.id}`}
          title="View trade"
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            "border border-zinc-300/60",
            "bg-[#eef1f5] text-zinc-400",
            "transition-all duration-300",
            insetShadow,
            "hover:-translate-y-0.5 hover:border-zinc-400 hover:text-zinc-900",
          ].join(" ")}
        >
          <Eye size={14} strokeWidth={1.8} />
        </Link>

        <button
          type="button"
          title="Delete trade"
          onClick={() => onDelete(trade.id)}
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            "border border-zinc-300/60",
            "bg-[#eef1f5] text-zinc-400",
            "transition-all duration-300",
            insetShadow,
            "hover:-translate-y-0.5 hover:border-red-400/70 hover:text-red-700",
          ].join(" ")}
        >
          <Trash2 size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradesLoading, setTradesLoading] = useState(true);
  const [tradesError, setTradesError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const [tradeSearch, setTradeSearch] = useState("");
  const [monthSearch, setMonthSearch] = useState("");

  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const monthSelectorRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------------ */
  /* Load trades                                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadTrades() {
      try {
        setTradesLoading(true);
        setTradesError(null);

        const result = await getTrades();

        if (!cancelled) {
          setTrades(result ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setTradesError(
            error instanceof Error
              ? error.message
              : "Unable to load trades.",
          );
        }
      } finally {
        if (!cancelled) {
          setTradesLoading(false);
        }
      }
    }

    loadTrades();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Hide scrollbar                                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const html = document.documentElement;

    const previousScrollbarWidth = html.style.scrollbarWidth;

    html.style.scrollbarWidth = "none";

    const style = document.createElement("style");

    style.innerHTML = `
      .trades-page-active::-webkit-scrollbar {
        display: none;
      }

      .trades-page-active {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
    `;

    document.head.appendChild(style);
    html.classList.add("trades-page-active");

    return () => {
      html.style.scrollbarWidth = previousScrollbarWidth;
      html.classList.remove("trades-page-active");
      style.remove();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Close dropdown outside                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        monthSelectorRef.current &&
        !monthSelectorRef.current.contains(event.target as Node)
      ) {
        setMonthDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Closed trades                                                            */
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
  /* Group trades by month                                                    */
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

    for (const key of Object.keys(groups)) {
      groups[key].sort(
        (a, b) =>
          new Date(String(b.exit_time)).getTime() -
          new Date(String(a.exit_time)).getTime(),
      );
    }

    return groups;
  }, [closedTrades]);

  /* ------------------------------------------------------------------------ */
  /* Month keys                                                               */
  /* ------------------------------------------------------------------------ */

  const monthKeys = useMemo(() => {
    return Object.keys(groupedTrades).sort((a, b) =>
      b.localeCompare(a),
    );
  }, [groupedTrades]);

  /* ------------------------------------------------------------------------ */
  /* Default selected month                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!selectedMonth && monthKeys.length > 0) {
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

  /* ------------------------------------------------------------------------ */
  /* Month search                                                             */
  /* ------------------------------------------------------------------------ */

  const filteredMonthKeys = useMemo(() => {
    const query = monthSearch.trim().toLowerCase();

    if (!query) {
      return monthKeys;
    }

    return monthKeys.filter((key) =>
      monthYearLabel(key).toLowerCase().includes(query),
    );
  }, [monthKeys, monthSearch]);

  /* ------------------------------------------------------------------------ */
  /* Current month trades                                                     */
  /* ------------------------------------------------------------------------ */

  const currentMonthTrades = useMemo(() => {
    if (!selectedMonth) return [];

    return groupedTrades[selectedMonth] ?? [];
  }, [groupedTrades, selectedMonth]);

  /* ------------------------------------------------------------------------ */
  /* Search trades                                                            */
  /* ------------------------------------------------------------------------ */

  const filteredTrades = useMemo(() => {
    const query = tradeSearch.trim().toLowerCase();

    if (!query) {
      return currentMonthTrades;
    }

    return currentMonthTrades.filter((trade) => {
      const symbol = String(trade.symbol ?? "").toLowerCase();
      const direction = String(trade.direction ?? "").toLowerCase();
      const setup = String(trade.setup ?? "").toLowerCase();
      const lesson = String(trade.lesson ?? "").toLowerCase();

      return (
        symbol.includes(query) ||
        direction.includes(query) ||
        setup.includes(query) ||
        lesson.includes(query)
      );
    });
  }, [currentMonthTrades, tradeSearch]);

  /* ------------------------------------------------------------------------ */
  /* Month P&L                                                                */
  /* ------------------------------------------------------------------------ */

  const monthPnl = useMemo(() => {
    return currentMonthTrades.reduce(
      (total, trade) => total + getNetPnl(trade),
      0,
    );
  }, [currentMonthTrades]);

  const isMonthProfit = monthPnl >= 0;

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleDelete() {
    if (deleteId === null) return;

    try {
      setDeleteLoading(true);

      await deleteTrade(deleteId);

      setTrades((previous) =>
        previous.filter((trade) => trade.id !== deleteId),
      );

      setDeleteId(null);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete trade.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (tradesLoading) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className={[
                "flex h-14 w-14 items-center justify-center rounded-2xl",
                "border border-zinc-300/70 bg-[#eef1f5]",
                neutralShadow,
              ].join(" ")}
            >
              <Loader2
                size={24}
                className="animate-spin text-zinc-500"
              />
            </div>

            <p
              className="text-sm font-normal text-zinc-500"
              style={numberFontStyle}
            >
              Loading trades...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (tradesError) {
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
            <div
              className={[
                "mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
                "bg-[#eef1f5] text-rose-500",
                insetShadow,
              ].join(" ")}
            >
              <X size={22} />
            </div>

            <h2
              className="text-xl font-normal text-zinc-900"
              style={displayFontStyle}
            >
              Unable to load trades
            </h2>

            <p
              className="mt-2 text-sm font-normal text-zinc-500"
              style={numberFontStyle}
            >
              {tradesError}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* No closed trades                                                         */
  /* ------------------------------------------------------------------------ */

  if (closedTrades.length === 0) {
    return (
      <main className="min-h-screen bg-[#eef1f5] px-5 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center">
          <div
            className={[
              "w-full max-w-md rounded-[28px]",
              "border border-zinc-300/70",
              "bg-[#eef1f5] p-10 text-center",
              neutralShadow,
            ].join(" ")}
          >
            <div
              className={[
                "mx-auto mb-5 flex h-16 w-16 items-center justify-center",
                "rounded-2xl bg-[#eef1f5] text-zinc-400",
                insetShadow,
              ].join(" ")}
            >
              <FileText size={28} strokeWidth={1.5} />
            </div>

            <h2
              className="text-2xl font-normal text-zinc-900"
              style={displayFontStyle}
            >
              No trades yet
            </h2>

            <p
              className="mt-2 text-sm font-normal leading-6 text-zinc-500"
              style={numberFontStyle}
            >
              Closed trades will appear here once you add them to your
              journal.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <main
        className="min-h-screen bg-[#eef1f5] px-3 py-5 sm:px-5 lg:px-7"
        style={numberFontStyle}
      >
        <div className="mx-auto w-full max-w-[1500px]">
          {/* ================================================================ */}
          {/* Header                                                           */}
          {/* ================================================================ */}

          <header className="mb-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              {/* Title */}

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />

                  <span
                    className="text-[9px] font-normal uppercase tracking-[0.16em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    The Millionaire Diary
                  </span>
                </div>

                <h1
                  className="text-[27px] font-normal leading-tight tracking-tight text-zinc-950 sm:text-[32px]"
                  style={displayFontStyle}
                >
                  Trades
                </h1>

                <p
                  className="mt-1.5 text-[11px] font-normal text-zinc-400 sm:text-xs"
                  style={numberFontStyle}
                >
                  Review your setups, entries, exits and trading performance.
                </p>
              </div>

              {/* Search */}

              <div className="relative w-full lg:max-w-[430px]">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={tradeSearch}
                  onChange={(event) =>
                    setTradeSearch(event.target.value)
                  }
                  placeholder="Search symbol, setup, notes..."
                  className={[
                    "h-11 w-full rounded-xl bg-[#eef1f5] pl-10 pr-10",
                    "text-xs font-normal text-zinc-700 outline-none",
                    "transition-all duration-300",
                    "placeholder:text-zinc-400",
                    insetShadow,
                  ].join(" ")}
                  style={numberFontStyle}
                />

                {tradeSearch && (
                  <button
                    type="button"
                    onClick={() => setTradeSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* ================================================================ */}
          {/* Controls Row                                                     */}
          {/* ================================================================ */}

          {selectedMonth && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Month Selector */}

              <div
                ref={monthSelectorRef}
                className="relative w-full sm:w-[260px]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setMonthDropdownOpen((previous) => !previous)
                  }
                  className={[
                    "flex h-10 w-full items-center justify-between",
                    "rounded-xl bg-[#eef1f5] px-4",
                    "text-xs font-normal text-zinc-600",
                    "transition-all duration-300",
                    monthDropdownOpen
                      ? insetShadow
                      : [
                          "border border-zinc-300/70",
                          neutralShadow,
                        ].join(" "),
                  ].join(" ")}
                  style={numberFontStyle}
                >
                  <span>{monthYearLabel(selectedMonth)}</span>

                  <ChevronDown
                    size={15}
                    className={[
                      "text-zinc-400 transition-transform duration-300",
                      monthDropdownOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {monthDropdownOpen && (
                  <div
                    className={[
                      "absolute left-0 top-[calc(100%+8px)] z-50",
                      "w-[260px] overflow-hidden rounded-2xl",
                      "border border-zinc-300/70",
                      "bg-[#eef1f5] p-2",
                      neutralShadow,
                    ].join(" ")}
                  >
                    <div className="relative mb-2">
                      <Search
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      />

                      <input
                        value={monthSearch}
                        onChange={(event) =>
                          setMonthSearch(event.target.value)
                        }
                        placeholder="Search month..."
                        className={[
                          "h-9 w-full rounded-lg bg-[#eef1f5] pl-9 pr-3",
                          "text-[11px] font-normal text-zinc-700 outline-none",
                          insetShadow,
                        ].join(" ")}
                        style={numberFontStyle}
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto">
                      {filteredMonthKeys.length === 0 ? (
                        <div
                          className="px-3 py-5 text-center text-[11px] text-zinc-400"
                          style={numberFontStyle}
                        >
                          No months found
                        </div>
                      ) : (
                        filteredMonthKeys.map((key) => {
                          const active = key === selectedMonth;

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setSelectedMonth(key);
                                setMonthDropdownOpen(false);
                                setMonthSearch("");
                                setTradeSearch("");
                              }}
                              className={[
                                "mb-1 flex w-full items-center justify-between",
                                "rounded-lg px-3 py-2.5 text-left text-[11px]",
                                "transition-all duration-200",
                                active
                                  ? [
                                      "bg-[#eef1f5] text-zinc-900",
                                      insetShadow,
                                    ].join(" ")
                                  : "text-zinc-500 hover:bg-[#e6e9ee]",
                              ].join(" ")}
                              style={numberFontStyle}
                            >
                              <span>{shortMonthYearLabel(key)}</span>

                              <span className="text-[9px] text-zinc-400">
                                {groupedTrades[key]?.length ?? 0}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right-side summary */}

              <div className="flex flex-wrap items-center gap-3">
                {/* Monthly P&L */}

                <div
                  className={[
                    "flex h-10 items-center rounded-xl",
                    "border border-zinc-300/70",
                    "bg-[#eef1f5] px-4",
                    "transition-[border-color,box-shadow] duration-300",
                    isMonthProfit ? profitBorder : lossBorder,
                    isMonthProfit ? profitShadow : lossShadow,
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[8px] font-normal uppercase tracking-[0.1em] text-zinc-400"
                      style={numberFontStyle}
                    >
                      Monthly P&L
                    </span>

                    <span
                      className="text-xs font-medium"
                      style={{
                        ...numberFontStyle,
                        color: isMonthProfit
                          ? PROFIT_COLOR
                          : LOSS_COLOR,
                      }}
                    >
                      {monthPnl >= 0 ? "+" : "-"}
                      {fmtMoney(monthPnl)}
                    </span>
                  </div>
                </div>

                {/* Trade Count */}

                <div
                  className={[
                    "flex h-10 items-center rounded-xl",
                    "border border-zinc-300/70",
                    "bg-[#eef1f5] px-4",
                    insetShadow,
                  ].join(" ")}
                >
                  <span
                    className="text-[9px] text-zinc-500"
                    style={numberFontStyle}
                  >
                    {filteredTrades.length}{" "}
                    {filteredTrades.length === 1
                      ? "trade"
                      : "trades"}
                  </span>
                </div>

                {/* Add Trade */}

                <Link
                  href="/trades/new"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-4 text-[9px] uppercase tracking-[0.12em] text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
                  style={numberFontStyle}
                >
                  <span className="text-sm leading-none">+</span>
                  Add Trade
                </Link>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* Empty Search Result                                              */}
          {/* ================================================================ */}

          {filteredTrades.length === 0 ? (
            <div
              className={[
                "rounded-[26px]",
                "border border-zinc-300/70",
                "bg-[#eef1f5] px-6 py-16 text-center",
                neutralShadow,
              ].join(" ")}
            >
              <div
                className={[
                  "mx-auto mb-4 flex h-14 w-14 items-center justify-center",
                  "rounded-2xl bg-[#eef1f5] text-zinc-400",
                  insetShadow,
                ].join(" ")}
              >
                <Search size={22} />
              </div>

              <h3
                className="text-lg font-normal text-zinc-800"
                style={displayFontStyle}
              >
                No matching trades
              </h3>

              <p
                className="mt-2 text-sm font-normal text-zinc-400"
                style={numberFontStyle}
              >
                Try another symbol, setup or note.
              </p>
            </div>
          ) : (
            /* ================================================================ */
            /* TABULAR CARD LIST                                                */
            /* ================================================================ */

            <div className="overflow-x-auto">
              <div className="min-w-[1080px]">
                {/* ============================================================ */}
                {/* DISTINCT TABLE HEADER                                        */}
                {/* ============================================================ */}

                <div
                  className={[
                    "mb-4 grid items-center gap-3 rounded-2xl",
                    "border border-zinc-300/70",
                    "bg-[#e7ebf0]",
                    "px-4 py-4.5 sm:px-5 sm:py-5",
                    "shadow-[inset_4px_4px_10px_rgba(163,177,198,0.20),inset_-4px_-4px_10px_rgba(255,255,255,0.95),0_3px_10px_rgba(163,177,198,0.10)]",
                  ].join(" ")}
                  style={{
                    gridTemplateColumns: GRID_TEMPLATE,
                  }}
                >
                  <FieldLabel>Symbol</FieldLabel>

                  <FieldLabel>Entry</FieldLabel>

                  <FieldLabel>Exit</FieldLabel>

                  <FieldLabel>P&L</FieldLabel>

                  <div className="text-center">
                    <FieldLabel>Lots</FieldLabel>
                  </div>

                  <FieldLabel>Setup</FieldLabel>

                  <FieldLabel>Notes</FieldLabel>

                  <div className="text-center">
                    <FieldLabel>Score</FieldLabel>
                  </div>

                  <div className="text-right">
                    <FieldLabel>Actions</FieldLabel>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* TRADE ROW CARDS                                               */}
                {/* ============================================================ */}

                <div className="space-y-4">
                  {filteredTrades.map((trade) => (
                    <TradeRowCard
                      key={trade.id}
                      trade={trade}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==================================================================== */}
      {/* Delete Confirmation                                                   */}
      {/* ==================================================================== */}

      {deleteId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/20 px-4 backdrop-blur-[2px]">
          <div
            className={[
              "w-full max-w-[420px] rounded-[28px]",
              "border border-zinc-300/70",
              "bg-[#eef1f5] p-6",
              neutralShadow,
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  className="text-xl font-normal text-zinc-900"
                  style={displayFontStyle}
                >
                  Delete trade?
                </h3>

                <p
                  className="mt-2 text-sm font-normal leading-6 text-zinc-500"
                  style={numberFontStyle}
                >
                  This trade will be permanently removed from your journal.
                  This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteId(null)}
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  "border border-zinc-300/60",
                  "bg-[#eef1f5] text-zinc-400",
                  "transition hover:border-zinc-400 hover:text-zinc-700",
                  insetShadow,
                ].join(" ")}
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {/* Cancel */}

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteId(null)}
                className={[
                  "rounded-xl",
                  "border border-zinc-300/70",
                  "bg-[#eef1f5] px-4 py-2.5",
                  "text-sm font-normal text-zinc-600",
                  "transition-all duration-300",
                  neutralShadow,
                ].join(" ")}
                style={numberFontStyle}
              >
                Cancel
              </button>

              {/* Delete */}

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-normal text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                style={numberFontStyle}
              >
                {deleteLoading && (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                )}

                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}