"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Flag,
  TrendingUp,
} from "lucide-react";

/* =========================================================
   FONTS
========================================================= */

const FONT_DISPLAY =
  'var(--font-space-grotesk, "Space Grotesk"), sans-serif';

const FONT_NUMBERS =
  'var(--font-inter, "Inter"), sans-serif';

/* =========================================================
   DARK VIOLET STYLES
========================================================= */

const card =
  "border border-violet-400/15 bg-[#121026] shadow-[0_12px_35px_rgba(0,0,0,0.22)]";

const softCard =
  "border border-violet-400/15 bg-[#15122a]";

const insetCard =
  "border border-violet-400/15 bg-[#0e0b1c]";

const gradientText =
  "bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent";

const greenGradient =
  "bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent";

/* =========================================================
   TYPES
========================================================= */

type MonthData = {
  month: string;
  start: number;
  end: number;
  pnl: number;
};

type YearData = {
  year: number;
  months: MonthData[];
};

/* =========================================================
   JOURNEY DATA
========================================================= */

const journey: YearData[] = [
  {
    year: 2026,
    months: [
      { month: "Jan", start: 100, end: 120, pnl: 20 },
      { month: "Feb", start: 120, end: 144, pnl: 24 },
      { month: "Mar", start: 144, end: 173, pnl: 29 },
      { month: "Apr", start: 173, end: 207, pnl: 35 },
      { month: "May", start: 207, end: 249, pnl: 41 },
      { month: "Jun", start: 249, end: 299, pnl: 50 },
      { month: "Jul", start: 299, end: 358, pnl: 60 },
      { month: "Aug", start: 358, end: 430, pnl: 72 },
      { month: "Sep", start: 430, end: 516, pnl: 86 },
      { month: "Oct", start: 516, end: 619, pnl: 103 },
      { month: "Nov", start: 619, end: 743, pnl: 124 },
      { month: "Dec", start: 743, end: 892, pnl: 149 },
    ],
  },
  {
    year: 2027,
    months: [
      { month: "Jan", start: 892, end: 1070, pnl: 178 },
      { month: "Feb", start: 1070, end: 1284, pnl: 214 },
      { month: "Mar", start: 1284, end: 1541, pnl: 257 },
      { month: "Apr", start: 1541, end: 1849, pnl: 308 },
      { month: "May", start: 1849, end: 2219, pnl: 370 },
      { month: "Jun", start: 2219, end: 2662, pnl: 444 },
      { month: "Jul", start: 2662, end: 3195, pnl: 532 },
      { month: "Aug", start: 3195, end: 3834, pnl: 639 },
      { month: "Sep", start: 3834, end: 4601, pnl: 767 },
      { month: "Oct", start: 4601, end: 5521, pnl: 920 },
      { month: "Nov", start: 5521, end: 6625, pnl: 1104 },
      { month: "Dec", start: 6625, end: 7950, pnl: 1325 },
    ],
  },
  {
    year: 2028,
    months: [
      { month: "Jan", start: 7950, end: 9540, pnl: 1590 },
      { month: "Feb", start: 9540, end: 11448, pnl: 1908 },
      { month: "Mar", start: 11448, end: 13737, pnl: 2290 },
      { month: "Apr", start: 13737, end: 16484, pnl: 2747 },
      { month: "May", start: 16484, end: 19781, pnl: 3297 },
      { month: "Jun", start: 19781, end: 23738, pnl: 3956 },
      { month: "Jul", start: 23738, end: 28485, pnl: 4748 },
      { month: "Aug", start: 28485, end: 34182, pnl: 5697 },
      { month: "Sep", start: 34182, end: 41019, pnl: 6836 },
      { month: "Oct", start: 41019, end: 49222, pnl: 8204 },
      { month: "Nov", start: 49222, end: 59067, pnl: 9844 },
      { month: "Dec", start: 59067, end: 70880, pnl: 11813 },
    ],
  },
  {
    year: 2029,
    months: [
      { month: "Jan", start: 70880, end: 81512, pnl: 10632 },
      { month: "Feb", start: 81512, end: 93739, pnl: 12227 },
      { month: "Mar", start: 93739, end: 107800, pnl: 14061 },
      { month: "Apr", start: 107800, end: 123970, pnl: 16170 },
      { month: "May", start: 123970, end: 142565, pnl: 18595 },
      { month: "Jun", start: 142565, end: 163950, pnl: 21385 },
      { month: "Jul", start: 163950, end: 188543, pnl: 24593 },
      { month: "Aug", start: 188543, end: 216824, pnl: 28281 },
      { month: "Sep", start: 216824, end: 249348, pnl: 32524 },
      { month: "Oct", start: 249348, end: 286750, pnl: 37402 },
      { month: "Nov", start: 286750, end: 329762, pnl: 43012 },
      { month: "Dec", start: 329762, end: 379227, pnl: 49464 },
    ],
  },
  {
    year: 2030,
    months: [
      { month: "Jan", start: 379227, end: 417149, pnl: 37923 },
      { month: "Feb", start: 417149, end: 458864, pnl: 41715 },
      { month: "Mar", start: 458864, end: 504751, pnl: 45886 },
      { month: "Apr", start: 504751, end: 555226, pnl: 50475 },
      { month: "May", start: 555226, end: 610748, pnl: 55523 },
      { month: "Jun", start: 610748, end: 671823, pnl: 61075 },
      { month: "Jul", start: 671823, end: 739006, pnl: 67182 },
      { month: "Aug", start: 739006, end: 812906, pnl: 73901 },
      { month: "Sep", start: 812906, end: 894197, pnl: 81291 },
      { month: "Oct", start: 894197, end: 983616, pnl: 89420 },
      { month: "Nov", start: 983616, end: 1081978, pnl: 98362 },
      { month: "Dec", start: 1081978, end: 1190176, pnl: 108198 },
    ],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

function getYearGrowth(months: MonthData[]) {
  if (!months.length) return 0;

  const start = months[0].start;
  const end = months[months.length - 1].end;

  return ((end - start) / start) * 100;
}

function getYearPnL(months: MonthData[]) {
  return months.reduce((total, month) => total + month.pnl, 0);
}

/* =========================================================
   MONTH CARD
========================================================= */

function MonthCard({ month }: { month: MonthData }) {
  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl
        ${softCard}
        p-5
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-emerald-400/40
        hover:shadow-[0_12px_35px_rgba(16,185,129,0.09)]
      `}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-60 transition-opacity group-hover:via-emerald-400/60" />

      {/* Month Header */}

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_9px_rgba(167,139,250,0.55)]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            {month.month}
          </span>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-medium tracking-[0.03em] text-emerald-300">
          +{formatMoney(month.pnl)}
        </span>
      </div>

      {/* Balance */}

      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.17em] text-zinc-500">
            Starting Balance
          </p>
          <p
            className="text-[15px] font-medium leading-none tracking-[-0.025em] text-zinc-300 tabular-nums"
            style={{ fontFamily: FONT_NUMBERS }}
          >
            {formatMoney(month.start)}
          </p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-violet-400/20 via-violet-300/10 to-transparent" />

        <div>
          <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.17em] text-zinc-500">
            Ending Balance
          </p>
          <p
            className={`text-xl font-medium leading-none tracking-[-0.035em] tabular-nums ${greenGradient}`}
            style={{ fontFamily: FONT_NUMBERS }}
          >
            {formatMoney(month.end)}
          </p>
        </div>
      </div>

      {/* P&L */}

      <div className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-emerald-400/15 bg-gradient-to-r from-emerald-400/[0.07] to-transparent px-3 py-3">
        <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-400">
          Monthly P&L
        </span>
        <span
          className="text-[13px] font-medium tracking-[-0.01em] text-emerald-300 tabular-nums"
          style={{ fontFamily: FONT_NUMBERS }}
        >
          +{formatMoney(month.pnl)}
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   YEAR CALENDAR
========================================================= */

function YearCalendar({
  data,
  index,
}: {
  data: YearData;
  index: number;
}) {
  const firstMonth = data.months[0];
  const lastMonth = data.months[data.months.length - 1];

  const yearStart = firstMonth?.start ?? 0;
  const yearEnd = lastMonth?.end ?? 0;

  const growth = getYearGrowth(data.months);
  const yearPnL = getYearPnL(data.months);

  const isLastYear = index === journey.length - 1;

  return (
    <section className="relative">
      {/* Year Header */}

      <div
        className={`
          relative mb-6 overflow-hidden rounded-3xl
          ${card}
          p-5 sm:p-6
          transition-colors duration-300
          hover:border-violet-300/30
        `}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-violet-500/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-400/[0.13] to-fuchsia-400/[0.04]">
              <CalendarDays
                className="h-5 w-5 text-violet-300"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.2em] text-violet-300/80">
                Trading Year
              </p>
              <h2
                className={`text-3xl font-medium leading-none tracking-[-0.04em] ${gradientText}`}
                style={{ fontFamily: FONT_NUMBERS }}
              >
                {data.year}
              </h2>
            </div>
          </div>

          {/* Year Stats */}

          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            <div>
              <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                Start
              </p>
              <p
                className="text-[13px] font-medium tracking-[-0.015em] text-zinc-200 tabular-nums sm:text-[15px]"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                {formatMoney(yearStart)}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                P&L
              </p>
              <p
                className="text-[13px] font-medium tracking-[-0.015em] text-emerald-300 tabular-nums sm:text-[15px]"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                +{formatMoney(yearPnL)}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                Growth
              </p>
              <p
                className="text-[13px] font-medium tracking-[-0.015em] text-emerald-300 tabular-nums sm:text-[15px]"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                +{growth.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}

        <div className="relative mt-6">
          <div className="mb-2 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-500">
            <span>Year Progress</span>
            <span>12 Months</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full border border-violet-400/10 bg-[#0e0b1c]">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]" />
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-violet-400/25 to-transparent" />
          <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-zinc-600">
            {yearStart.toLocaleString("en-US")} → {yearEnd.toLocaleString("en-US")}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-fuchsia-400/20 to-transparent" />
        </div>
      </div>

      {/* Calendar */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.months.map((month) => (
          <MonthCard
            key={`${data.year}-${month.month}`}
            month={month}
          />
        ))}
      </div>

      {/* Next Year Connector */}

      {!isLastYear && (
        <div className="flex justify-center py-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/20 bg-[#15122a] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <ArrowDownIcon />
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   DOWN ICON
========================================================= */

function ArrowDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-violet-300"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M12 5v14M6 13l6 6 6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function JourneyPage() {
  const startingBalance = journey[0].months[0].start;

  const finalYear = journey[journey.length - 1];
  const finalBalance =
    finalYear.months[finalYear.months.length - 1].end;

  const totalPnL = finalBalance - startingBalance;

  return (
    <main
      className="min-h-screen bg-[#0b0718] px-4 py-6 text-zinc-100 sm:px-6 lg:px-8"
      style={{ fontFamily: FONT_DISPLAY }}
    >
      <div className="mx-auto max-w-7xl">
        {/* TOP NAV */}

        <div className="mb-8 flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className={`group inline-flex items-center gap-3 rounded-xl ${softCard} px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-300 transition-all duration-300 hover:border-violet-300/50 hover:bg-violet-400/[0.06] hover:text-violet-200 sm:px-5`}
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />
            Back to Dashboard
          </Link>

          <div className={`hidden items-center gap-2 rounded-xl ${softCard} px-4 py-3 text-[9px] font-medium uppercase tracking-[0.18em] text-violet-200 sm:flex`}>
            <TrendingUp
              className="h-3.5 w-3.5 text-violet-300"
              strokeWidth={1.7}
            />
            Long-Term Plan
          </div>
        </div>

        {/* HEADER */}

        <div className="mb-8 max-w-3xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-7 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
            <span className="text-[9px] font-medium uppercase tracking-[0.23em] text-violet-300">
              The Millionaire Diary
            </span>
          </div>

          <h1
            className={`text-3xl font-medium leading-[1.12] tracking-[-0.04em] sm:text-5xl ${gradientText}`}
            style={{ fontFamily: FONT_DISPLAY }}
          >
            The Millionaire Diary
          </h1>

          <p className="mt-4 max-w-2xl text-[12px] font-normal leading-[1.8] tracking-[0.005em] text-zinc-400 sm:text-[13px]">
            A month-by-month roadmap showing the planned progression from the
            starting balance toward the long-term destination.
          </p>
        </div>

        {/* DESTINATION CARD */}

        <section className={`relative mb-7 overflow-hidden rounded-3xl ${card}`}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.10] via-transparent to-fuchsia-500/[0.06]" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.09] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-fuchsia-500/[0.06] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />

          <div className="relative p-5 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/25 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/[0.06]">
                  <Flag
                    className="h-5 w-5 text-violet-200"
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-violet-300/80">
                    Final Destination
                  </p>
                  <p
                    className={`text-2xl font-medium tracking-[-0.035em] tabular-nums sm:text-3xl ${greenGradient}`}
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    $ {formatMoney(finalBalance)}
                  </p>
                </div>
              </div>

              <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-violet-300/30 to-transparent lg:block" />

              <div className="max-w-lg lg:text-right">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  The Vision
                </p>
                <p className={`mt-2 text-base font-medium leading-[1.7] tracking-[-0.015em] sm:text-lg ${gradientText}`}>
                  I Am The Millionaire
                  <br className="hidden sm:block" /> The Power Of Discipline
                  And Compounding
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUMMARY CARDS */}

        <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Starting Balance */}

          <div className={`group relative overflow-hidden rounded-2xl ${softCard} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/40 hover:shadow-[0_12px_35px_rgba(139,92,246,0.10)]`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                Starting Balance
              </span>
              <CircleDollarSign
                className="h-4 w-4 text-violet-300"
                strokeWidth={1.6}
              />
            </div>
            <p
              className="text-2xl font-medium leading-none tracking-[-0.035em] text-zinc-100 tabular-nums"
              style={{ fontFamily: FONT_NUMBERS }}
            >
              $ {formatMoney(startingBalance)}
            </p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              Initial capital
            </p>
          </div>

          {/* Total P&L */}

          <div className={`group relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-[#15122a] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:shadow-[0_12px_35px_rgba(16,185,129,0.10)]`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                Total P&L
              </span>
              <TrendingUp
                className="h-4 w-4 text-emerald-300"
                strokeWidth={1.7}
              />
            </div>
            <p
              className="text-2xl font-medium leading-none tracking-[-0.035em] text-emerald-300 tabular-nums"
              style={{ fontFamily: FONT_NUMBERS }}
            >
              $ {formatMoney(totalPnL)}
            </p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-emerald-300/60">
              Cumulative growth
            </p>
          </div>

          {/* Final Balance */}

          <div className={`group relative overflow-hidden rounded-2xl ${softCard} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/40 hover:shadow-[0_12px_35px_rgba(217,70,239,0.10)]`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                Final Balance
              </span>
              <Flag
                className="h-4 w-4 text-fuchsia-300"
                strokeWidth={1.7}
              />
            </div>
            <p
              className={`text-2xl font-medium leading-none tracking-[-0.035em] tabular-nums ${gradientText}`}
              style={{ fontFamily: FONT_NUMBERS }}
            >
              $ {formatMoney(finalBalance)}
            </p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              Projected destination
            </p>
          </div>
        </div>

        {/* THE ROUTE */}

        <section className={`relative mb-9 overflow-hidden rounded-3xl ${insetCard} p-5 sm:p-7`}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-5 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-violet-300">
                  The Route
                </p>
              </div>
              <h2
                className={`text-xl font-medium tracking-[-0.025em] sm:text-2xl ${gradientText}`}
                style={{ fontFamily: FONT_DISPLAY }}
              >
                One month at a time.
              </h2>
            </div>

            <p className="max-w-xl text-[11px] font-normal leading-[1.8] tracking-[0.005em] text-zinc-400">
              Every calendar represents another stage of the journey. Focus on
              the current month, follow the plan, protect the downside, and let
              the numbers compound naturally.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { number: "01", label: "Stay Consistent" },
              { number: "02", label: "Protect Capital" },
              { number: "03", label: "Compound" },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-violet-400/10 bg-[#15122a] px-3 py-3"
              >
                <span
                  className="text-[10px] font-medium text-violet-300"
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  {item.number}
                </span>
                <p className="mt-1.5 text-[9px] font-medium uppercase leading-[1.5] tracking-[0.1em] text-zinc-400 sm:text-[10px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* YEAR CALENDARS */}

        <div className="space-y-0">
          {journey.map((year, index) => (
            <YearCalendar
              key={year.year}
              data={year}
              index={index}
            />
          ))}
        </div>

        {/* FINAL REMINDER */}

        <section className={`relative mt-10 overflow-hidden rounded-3xl ${card} p-6 sm:p-9`}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.07] via-transparent to-fuchsia-500/[0.06]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.12] to-violet-400/[0.05]">
              <CheckCircle2
                className="h-5 w-5 text-emerald-300"
                strokeWidth={1.7}
              />
            </div>

            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-violet-300">
              Discipline · Patience · Consistency
            </p>

            <h2
              className={`mt-3 text-2xl font-medium tracking-[-0.035em] sm:text-3xl ${gradientText}`}
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Trust the process.
            </h2>

            <p className="mt-4 max-w-xl text-[12px] font-normal leading-[1.85] tracking-[0.005em] text-zinc-400">
              The destination is built through thousands of small decisions.
              Follow the rules, respect risk, journal the process, and stay
              focused on the month directly in front of you.
            </p>

            <Link
              href="/dashboard"
              className="group mt-7 inline-flex items-center gap-2.5 rounded-xl border border-violet-300/25 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.13em] text-white transition-all duration-300 hover:border-violet-200/60 hover:shadow-[0_8px_28px_rgba(139,92,246,0.30)]"
            >
              Return to Dashboard
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="mt-8 border-t border-violet-400/15 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[9px] font-medium uppercase tracking-[0.17em] text-zinc-600">
              The Millionaire Diary · Long-Term Plan
            </p>
            <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-600">
              Plan · Execute · Review · Refine
            </p>
          </div>
          <p className="mt-4 max-w-3xl text-[10px] leading-[1.7] text-zinc-600">
            This roadmap is a projection, not a guarantee of returns. Actual
            trading results vary, and losses are possible. Prioritize risk
            management and validate your strategy with real performance data.
          </p>
        </footer>
      </div>
    </main>
  );
}
