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
  '"Lucida Fax", "Lucida Bright", Georgia, serif';

const FONT_NUMBERS =
  '"Rubik", "Gotham", Arial, sans-serif';

/* =========================================================
   NEUMORPHIC STYLES
========================================================= */

const neutralShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)]";

const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.16),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]";

const profitShadow =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.20),-7px_-7px_18px_rgba(255,255,255,0.95)] hover:shadow-[9px_9px_24px_rgba(163,177,198,0.22),-9px_-9px_24px_rgba(255,255,255,1),0_7px_28px_rgba(21,128,61,0.28)]";

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

function MonthCard({
  month,
}: {
  month: MonthData;
}) {
  return (
    <div
      className={`
        group
        rounded-2xl
        border
        border-zinc-300/70
        bg-[#eef1f5]
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-green-600/70
        ${profitShadow}
      `}
    >
      {/* Month Header */}

      <div className="mb-4 flex items-center justify-between">
        <div
          className="
            text-[11px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-zinc-500
          "
        >
          {month.month}
        </div>

        <div
          className="
            rounded-full
            border
            border-green-700/10
            bg-green-700/[0.06]
            px-2
            py-1
            text-[10px]
            font-medium
            tracking-[0.04em]
            text-green-700
          "
        >
          +{formatMoney(month.pnl)}
        </div>
      </div>

      {/* Balance */}

      <div className="space-y-3">
        <div>
          <div
            className="
              mb-1
              text-[9px]
              font-medium
              uppercase
              tracking-[0.17em]
              text-zinc-400
            "
          >
            Starting
          </div>

          <div
            className="
              text-[15px]
              font-medium
              leading-none
              tracking-[-0.025em]
              text-zinc-700
              tabular-nums
            "
            style={{ fontFamily: FONT_NUMBERS }}
          >
            {formatMoney(month.start)}
          </div>
        </div>

        <div
          className="
            h-px
            w-full
            bg-zinc-300/70
          "
        />

        <div>
          <div
            className="
              mb-1
              text-[9px]
              font-medium
              uppercase
              tracking-[0.17em]
              text-zinc-400
            "
          >
            Ending
          </div>

          <div
            className="
              text-[18px]
              font-medium
              leading-none
              tracking-[-0.025em]
              text-zinc-900
              tabular-nums
            "
            style={{ fontFamily: FONT_NUMBERS }}
          >
            {formatMoney(month.end)}
          </div>
        </div>
      </div>

      {/* P&L */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          rounded-xl
          border
          border-green-700/10
          bg-green-700/[0.045]
          px-3
          py-2.5
        "
      >
        <span
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-zinc-500
          "
        >
          Monthly P&L
        </span>

        <span
          className="
            text-[13px]
            font-medium
            tracking-[-0.01em]
            text-green-700
            tabular-nums
          "
          style={{ fontFamily: FONT_NUMBERS }}
        >
          +{formatMoney(month.pnl)}
        </span>
      </div>
    </div>
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
          mb-6
          rounded-3xl
          border
          border-zinc-300/70
          bg-[#eef1f5]
          p-5
          sm:p-6
          ${neutralShadow}
        `}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-zinc-300/70
                bg-[#eef1f5]
              "
              style={{
                boxShadow:
                  "inset 3px 3px 8px rgba(163,177,198,0.14), inset -3px -3px 8px rgba(255,255,255,0.9)",
              }}
            >
              <CalendarDays
                className="h-5 w-5 text-zinc-700"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <div
                className="
                  mb-1
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-zinc-400
                "
              >
                Trading Year
              </div>

              <h2
                className="
                  text-2xl
                  font-medium
                  leading-none
                  tracking-[-0.025em]
                  text-zinc-900
                  sm:text-3xl
                "
                style={{ fontFamily: FONT_NUMBERS }}
              >
                {data.year}
              </h2>
            </div>
          </div>

          {/* Year Stats */}

          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            <div>
              <div
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-400
                "
              >
                Start
              </div>

              <div
                className="
                  text-[13px]
                  font-medium
                  tracking-[-0.015em]
                  text-zinc-700
                  tabular-nums
                  sm:text-[15px]
                "
                style={{ fontFamily: FONT_NUMBERS }}
              >
                {formatMoney(yearStart)}
              </div>
            </div>

            <div>
              <div
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-400
                "
              >
                P&L
              </div>

              <div
                className="
                  text-[13px]
                  font-medium
                  tracking-[-0.015em]
                  text-green-700
                  tabular-nums
                  sm:text-[15px]
                "
                style={{ fontFamily: FONT_NUMBERS }}
              >
                +{formatMoney(yearPnL)}
              </div>
            </div>

            <div>
              <div
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-400
                "
              >
                Growth
              </div>

              <div
                className="
                  text-[13px]
                  font-medium
                  tracking-[-0.015em]
                  text-green-700
                  tabular-nums
                  sm:text-[15px]
                "
                style={{ fontFamily: FONT_NUMBERS }}
              >
                +{growth.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}

        <div className="mt-5">
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
              text-[9px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-zinc-400
            "
          >
            <span>Year Progress</span>
            <span>12 Months</span>
          </div>

          <div
            className={`
              h-2
              overflow-hidden
              rounded-full
              bg-[#eef1f5]
              ${insetShadow}
            `}
          >
            <div
              className="
                h-full
                w-full
                rounded-full
                bg-green-700/70
              "
            />
          </div>
        </div>
      </div>

      {/* Calendar */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
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
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-zinc-300/70
              bg-[#eef1f5]
            "
            style={{
              boxShadow:
                "3px 3px 8px rgba(163,177,198,0.18),-3px -3px 8px rgba(255,255,255,0.9)",
            }}
          >
            <ArrowDownIcon />
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   SIMPLE DOWN ICON
========================================================= */

function ArrowDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-zinc-500"
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
      className="
        min-h-screen
        bg-[#eef1f5]
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            TOP NAV
        ================================================= */}

        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-zinc-300/70
              bg-[#eef1f5]
              px-3
              py-2
              text-[11px]
              font-medium
              tracking-[0.02em]
              text-zinc-600
              transition-all
              duration-300
              hover:border-green-600/70
              hover:text-green-700
              hover:shadow-[0_6px_20px_rgba(21,128,61,0.18)]
            "
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />

            Back to Dashboard
          </Link>

          <div
            className="
              hidden
              items-center
              gap-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-zinc-400
              sm:flex
            "
          >
            <TrendingUp
              className="h-3.5 w-3.5"
              strokeWidth={1.7}
            />

            Long-Term Plan
          </div>
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 max-w-3xl">
          <div
            className="
              mb-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-green-700
            "
          >
            The Millionaire Diary
          </div>

          <h1
            className="
              text-3xl
              font-medium
              leading-tight
              tracking-[-0.025em]
              text-zinc-900
              sm:text-4xl
            "
            style={{ fontFamily: FONT_DISPLAY }}
          >
            The Millionaire Diary
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-[12px]
              font-normal
              leading-[1.7]
              tracking-[0.005em]
              text-zinc-500
              sm:text-[13px]
            "
          >
            A month-by-month roadmap showing the planned
            progression from the starting balance toward the
            long-term destination.
          </p>
        </div>

        {/* =================================================
            DESTINATION CARD
        ================================================= */}

        <div
          className={`
            mb-7
            overflow-hidden
            rounded-3xl
            border
            border-zinc-300/70
            bg-[#eef1f5]
            ${neutralShadow}
          `}
        >
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Destination */}

              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-zinc-300/70
                    bg-[#eef1f5]
                  "
                  style={{
                    boxShadow:
                      "inset 3px 3px 8px rgba(163,177,198,0.14), inset -3px -3px 8px rgba(255,255,255,0.9)",
                  }}
                >
                  <Flag
                    className="h-5 w-5 text-green-700"
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <div
                    className="
                      mb-1
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-zinc-400
                    "
                  >
                    Final Destination
                  </div>

                  <div
                    className="
                      text-xl
                      font-medium
                      tracking-[-0.02em]
                      text-zinc-900
                      tabular-nums
                      sm:text-2xl
                    "
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    {formatMoney(finalBalance)}
                  </div>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-zinc-300/70 lg:block" />

              {/* Message */}

              <div className="max-w-lg">
                <p
                  className="
                    text-[15px]
                    font-normal
                    leading-[1.7]
                    tracking-[0.005em]
                    text-zinc-500
                  "
                >
                  I Am The Millionaire The Power
                  Of Discipline And Compounding
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div
          className="
            mb-9
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          {/* Starting Balance */}

          <div
            className={`
              rounded-2xl
              border
              border-zinc-300/70
              bg-[#eef1f5]
              p-5
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-green-600/70
              ${profitShadow}
            `}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-zinc-400
                "
              >
                Starting Balance
              </span>

              <CircleDollarSign
                className="h-4 w-4 text-zinc-400"
                strokeWidth={1.6}
              />
            </div>

            <div
              className="
                text-2xl
                font-medium
                leading-none
                tracking-[-0.025em]
                text-zinc-900
                tabular-nums
              "
              style={{ fontFamily: FONT_NUMBERS }}
            >
              $ {formatMoney(startingBalance)}
            </div>
          </div>

          {/* Total P&L */}

          <div
            className={`
              rounded-2xl
              border
              border-zinc-300/70
              bg-[#eef1f5]
              p-5
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-green-600/70
              ${profitShadow}
            `}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-zinc-400
                "
              >
                Total P&L
              </span>

              <TrendingUp
                className="h-4 w-4 text-green-700"
                strokeWidth={1.7}
              />
            </div>

            <div
              className="
                text-2xl
                font-medium
                leading-none
                tracking-[-0.025em]
                text-green-700
                tabular-nums
              "
              style={{ fontFamily: FONT_NUMBERS }}
            >
              $ {formatMoney(totalPnL)}
            </div>
          </div>

          {/* Final Balance */}

          <div
            className={`
              rounded-2xl
              border
              border-zinc-300/70
              bg-[#eef1f5]
              p-5
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-green-600/70
              ${profitShadow}
            `}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-zinc-400
                "
              >
                Final Balance
              </span>

              <Flag
                className="h-4 w-4 text-green-700"
                strokeWidth={1.7}
              />
            </div>

            <div
              className="
                text-2xl
                font-medium
                leading-none
                tracking-[-0.025em]
                text-zinc-900
                tabular-nums
              "
              style={{ fontFamily: FONT_NUMBERS }}
            >
              $ {formatMoney(finalBalance)}
            </div>
          </div>
        </div>

        {/* =================================================
            THE ROUTE
        ================================================= */}

        <div
          className="
            mb-9
            rounded-3xl
            border
            border-zinc-300/70
            bg-[#eef1f5]
            p-5
            sm:p-6
          "
          style={{
            boxShadow:
              "inset 4px 4px 10px rgba(163,177,198,0.13), inset -4px -4px 10px rgba(255,255,255,0.88)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div
                className="
                  mb-1
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-green-700
                "
              >
                The Route
              </div>

              <h2
                className="
                  text-lg
                  font-medium
                  tracking-[-0.02em]
                  text-zinc-900
                "
                style={{ fontFamily: FONT_DISPLAY }}
              >
                One month at a time.
              </h2>
            </div>

            <div
              className="
                max-w-xl
                text-[11px]
                font-normal
                leading-[1.7]
                tracking-[0.005em]
                text-zinc-500
              "
            >
              Every calendar represents another stage of
              the journey. Focus on the current month, follow
              the plan, protect the downside, and let the
              numbers compound naturally.
            </div>
          </div>
        </div>

        {/* =================================================
            YEAR CALENDARS
        ================================================= */}

        <div className="space-y-0">
          {journey.map((year, index) => (
            <YearCalendar
              key={year.year}
              data={year}
              index={index}
            />
          ))}
        </div>

        {/* =================================================
            FINAL REMINDER
        ================================================= */}

        <div
          className={`
            mt-10
            rounded-3xl
            border
            border-zinc-300/70
            bg-[#eef1f5]
            p-6
            sm:p-8
            ${neutralShadow}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className="
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-green-700/20
                bg-green-700/[0.06]
              "
            >
              <CheckCircle2
                className="h-5 w-5 text-green-700"
                strokeWidth={1.7}
              />
            </div>

            <h2
              className="
                text-xl
                font-medium
                tracking-[-0.02em]
                text-zinc-900
                sm:text-2xl
              "
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Trust the process.
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-[12px]
                font-normal
                leading-[1.8]
                tracking-[0.005em]
                text-zinc-500
              "
            >
              The destination is built through thousands of
              small decisions. Follow the rules, respect risk,
              journal the process, and stay focused on the
              month directly in front of you.
            </p>

            <Link
              href="/dashboard"
              className="
                group
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-zinc-900
                bg-zinc-900
                px-5
                py-3
                text-[11px]
                font-medium
                tracking-[0.03em]
                text-white
                transition-all
                duration-300
                hover:border-green-600
                hover:bg-zinc-900
                hover:shadow-[0_7px_26px_rgba(21,128,61,0.28)]
              "
            >
              Return to Dashboard

              <ArrowRight
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
