"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  DollarSign,
  FileText,
  Loader2,
  Pencil,
  ShieldAlert,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import {
  deleteTrade,
  getTrade,
  type Trade,
} from "@/lib/api";

const FONT_DISPLAY = '"Lucida Fax", "Lucida Bright", Georgia, serif';
const FONT_NUMBERS = '"Rubik", "Gotham", Arial, sans-serif';

const PROFIT_COLOR = "#15803d";
const LOSS_COLOR = "#b91c1c";

/* -------------------------------------------------------------------------- */
/* Fonts                                                                      */
/* -------------------------------------------------------------------------- */

const displayFontStyle = {
  fontFamily: FONT_DISPLAY,
  letterSpacing: "0.08em",
} as const;

const numberFontStyle = {
  fontFamily: FONT_NUMBERS,
  letterSpacing: "0.06em",
} as const;

/* -------------------------------------------------------------------------- */
/* Shadows                                                                    */
/* -------------------------------------------------------------------------- */

const CARD_SHADOW =
  "shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)]";

const SMALL_SHADOW =
  "shadow-[5px_5px_13px_rgba(163,177,198,0.20),-5px_-5px_13px_rgba(255,255,255,0.9)]";

const INSET_SHADOW =
  "shadow-[inset_4px_4px_9px_rgba(163,177,198,0.15),inset_-4px_-4px_9px_rgba(255,255,255,0.9)]";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function toNum(value: string | number | null | undefined): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function fmtMoney(
  value: string | number | null | undefined,
  decimals = 2,
): string {
  const num = toNum(value);

  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtPrice(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const num = Number(value);

  if (!Number.isFinite(num)) {
    return "—";
  }

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  });
}

function fmtDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDateTime(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return `${fmtDate(value)} · ${fmtTime(value)}`;
}

/* -------------------------------------------------------------------------- */
/* P&L hover helpers                                                          */
/* -------------------------------------------------------------------------- */

function pnlHoverClass(positive: boolean) {
  return positive
    ? "hover:border-green-600/70 hover:shadow-[8px_8px_20px_rgba(163,177,198,0.25),-8px_-8px_20px_rgba(255,255,255,0.98),0_0_18px_rgba(21,128,61,0.58),0_8px_30px_rgba(21,128,61,0.40)]"
    : "hover:border-red-600/70 hover:shadow-[8px_8px_20px_rgba(163,177,198,0.25),-8px_-8px_20px_rgba(255,255,255,0.98),0_0_18px_rgba(185,28,28,0.58),0_8px_30px_rgba(185,28,28,0.40)]";
}

/* -------------------------------------------------------------------------- */
/* Small reusable components                                                  */
/* -------------------------------------------------------------------------- */

function InfoItem({
  label,
  value,
  valueClassName = "",
  icon,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        {icon && (
          <span className="text-zinc-400">
            {icon}
          </span>
        )}

        <span
          className="text-[9px] uppercase tracking-[0.12em] text-zinc-400"
          style={numberFontStyle}
        >
          {label}
        </span>
      </div>

      <p
        className={`text-sm text-zinc-800 ${valueClassName}`}
        style={numberFontStyle}
      >
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`
        rounded-[24px]
        border border-zinc-300/70
        bg-[#eef1f5]
        p-5
        ${CARD_SHADOW}
        transition-all duration-300
        hover:-translate-y-0.5
        sm:p-6
      `}
    >
      <div className="mb-6 flex items-start gap-3">
        {icon && (
          <div
            className={`
              mt-0.5
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              border border-zinc-300/70
              bg-[#eef1f5]
              text-zinc-500
              ${SMALL_SHADOW}
            `}
          >
            {icon}
          </div>
        )}

        <div>
          <h2
            className="text-[18px] font-normal text-zinc-900"
            style={displayFontStyle}
          >
            {title}
          </h2>

          {description && (
            <p
              className="mt-1.5 text-xs text-zinc-400"
              style={numberFontStyle}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load trade                                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function loadTrade() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTrade(Number(id));

        if (mounted) {
          setTrade(data);
        }
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this trade.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTrade();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ------------------------------------------------------------------------ */
  /* Derived values                                                           */
  /* ------------------------------------------------------------------------ */

  const netPnl = useMemo(() => {
    if (!trade) return 0;

    return toNum(trade.pnl) - toNum(trade.fees);
  }, [trade]);

  const isProfit = netPnl >= 0;

  const riskReward = useMemo(() => {
    if (!trade) return null;

    const entry = toNum(trade.entry_price);
    const tp = toNum(trade.take_profit);
    const sl = toNum(trade.stop_loss);

    if (!entry || !tp || !sl) {
      return null;
    }

    const reward =
      trade.direction === "LONG"
        ? Math.abs(tp - entry)
        : Math.abs(entry - tp);

    const risk =
      trade.direction === "LONG"
        ? Math.abs(entry - sl)
        : Math.abs(sl - entry);

    if (!risk) {
      return null;
    }

    return reward / risk;
  }, [trade]);

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleDelete() {
    if (!trade) return;

    try {
      setDeleting(true);

      await deleteTrade(trade.id);

      router.push("/trades");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this trade.",
      );

      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#eef1f5] px-4"
        style={{ fontFamily: FONT_NUMBERS }}
      >
        <div
          className={`
            flex items-center gap-3
            rounded-2xl
            border border-zinc-300/70
            bg-[#eef1f5]
            px-5 py-4
            ${CARD_SHADOW}
          `}
        >
          <Loader2
            size={17}
            className="animate-spin text-zinc-500"
          />

          <span
            className="text-[11px] uppercase tracking-[0.12em] text-zinc-500"
            style={numberFontStyle}
          >
            Loading trade
          </span>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (error || !trade) {
    return (
      <main
        className="min-h-screen bg-[#eef1f5] px-4 py-8 sm:px-6 lg:px-8"
        style={{ fontFamily: FONT_NUMBERS }}
      >
        <div className="mx-auto max-w-[1180px]">
          <Link
            href="/trades"
            className="mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-zinc-400 transition-all duration-300 hover:-translate-x-0.5 hover:text-zinc-800"
            style={numberFontStyle}
          >
            <ArrowLeft size={15} />
            Back to Trades
          </Link>

          <div
            className="
              rounded-[24px]
              border border-zinc-300/70
              bg-[#eef1f5]
              p-8
              text-center
              shadow-[7px_7px_18px_rgba(163,177,198,0.24),-7px_-7px_18px_rgba(255,255,255,0.95)]
              hover:border-red-600/70
              hover:shadow-[8px_8px_20px_rgba(163,177,198,0.25),-8px_-8px_20px_rgba(255,255,255,0.98),0_0_18px_rgba(185,28,28,0.55),0_8px_30px_rgba(185,28,28,0.38)]
              transition-all duration-300
            "
          >
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-red-200/80 bg-[#eef1f5] text-red-600 shadow-inner">
              <X size={19} />
            </div>

            <h1
              className="text-xl text-zinc-900"
              style={displayFontStyle}
            >
              Trade Not Found
            </h1>

            <p
              className="mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-400"
              style={numberFontStyle}
            >
              {error || "The requested trade could not be found."}
            </p>

            <Link
              href="/trades"
              className="
                mt-6
                inline-flex
                h-10
                items-center
                justify-center
                rounded-xl
                border border-zinc-700/70
                bg-zinc-900
                px-5
                text-[10px]
                uppercase
                tracking-[0.13em]
                text-white
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-green-600/70
                hover:shadow-[8px_8px_18px_rgba(163,177,198,0.28),-7px_-7px_16px_rgba(255,255,255,0.85),0_0_18px_rgba(21,128,61,0.58),0_7px_32px_rgba(21,128,61,0.42)]
              "
              style={numberFontStyle}
            >
              View Trades
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <main
      className="min-h-screen bg-[#eef1f5] px-4 py-5 sm:px-6 lg:px-8"
      style={{ fontFamily: FONT_NUMBERS }}
    >
      <div className="mx-auto max-w-[1180px]">

        {/* ---------------------------------------------------------------- */}
        {/* Back                                                               */}
        {/* ---------------------------------------------------------------- */}

        <Link
          href="/trades"
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            text-[11px]
            font-normal
            uppercase
            tracking-[0.12em]
            text-zinc-400
            transition-all duration-300
            hover:-translate-x-0.5
            hover:text-zinc-800
          "
          style={numberFontStyle}
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Back to Trades
        </Link>

        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                               */}
        {/* ---------------------------------------------------------------- */}

        <section
          className={`
            relative
            mb-5
            overflow-hidden
            rounded-[26px]
            border
            border-zinc-300/70
            bg-[#eef1f5]
            p-5
            ${CARD_SHADOW}
            transition-all duration-300
            hover:-translate-y-0.5
            ${pnlHoverClass(isProfit)}
            sm:p-7
          `}
        >
          {/* Soft P&L glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-[0.08]"
            style={{
              backgroundColor: isProfit
                ? PROFIT_COLOR
                : LOSS_COLOR,
            }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">

                {/* Direction */}
                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-zinc-300/70
                    bg-[#eef1f5]
                    px-2.5
                    py-1
                    text-[9px]
                    uppercase
                    tracking-[0.13em]
                    transition-all duration-300
                    ${
                      trade.direction === "LONG"
                        ? "text-green-700 hover:border-green-600/60"
                        : "text-red-700 hover:border-red-600/60"
                    }
                  `}
                  style={numberFontStyle}
                >
                  {trade.direction === "LONG" ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}

                  {trade.direction}
                </span>

                {/* Status */}
                <span
                  className={`
                    rounded-lg
                    border
                    border-zinc-300/70
                    bg-[#eef1f5]
                    px-2.5
                    py-1
                    text-[9px]
                    uppercase
                    tracking-[0.13em]
                    ${
                      trade.exit_time && trade.exit_price
                        ? "text-zinc-500"
                        : "text-amber-700"
                    }
                  `}
                  style={numberFontStyle}
                >
                  {trade.exit_time && trade.exit_price
                    ? "Closed"
                    : "Open"}
                </span>
              </div>

              <h1
                className="text-3xl font-normal text-zinc-950 sm:text-4xl"
                style={displayFontStyle}
              >
                {trade.symbol}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">

                <div className="flex items-center gap-1.5 text-zinc-400">
                  <CalendarDays size={13} />

                  <span
                    className="text-[10px] uppercase tracking-[0.1em]"
                    style={numberFontStyle}
                  >
                    {fmtDate(trade.entry_time)}
                  </span>
                </div>

                <div className="h-1 w-1 rounded-full bg-zinc-300" />

                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock3 size={13} />

                  <span
                    className="text-[10px] uppercase tracking-[0.1em]"
                    style={numberFontStyle}
                  >
                    {fmtTime(trade.entry_time)}
                  </span>
                </div>

                <div className="h-1 w-1 rounded-full bg-zinc-300" />

                <span
                  className="text-[10px] uppercase tracking-[0.1em] text-zinc-400"
                  style={numberFontStyle}
                >
                  {fmtMoney(trade.lots, 2)} lots
                </span>
              </div>
            </div>

            {/* P&L */}
            <div className="lg:text-right">
              <p
                className="mb-1 text-[9px] uppercase tracking-[0.14em] text-zinc-400"
                style={numberFontStyle}
              >
                Net P&L
              </p>

              <div
                className="text-4xl font-normal sm:text-5xl"
                style={{
                  ...numberFontStyle,
                  color: isProfit
                    ? PROFIT_COLOR
                    : LOSS_COLOR,
                  textShadow: isProfit
                    ? "0 0 22px rgba(21,128,61,0.18)"
                    : "0 0 22px rgba(185,28,28,0.18)",
                }}
              >
                {isProfit ? "+" : "-"}
                {fmtMoney(Math.abs(netPnl))}
              </div>

              <p
                className="mt-2 text-[9px] uppercase tracking-[0.1em] text-zinc-400"
                style={numberFontStyle}
              >
                P&L {isProfit ? "+" : ""}
                {fmtMoney(trade.pnl)}
                {" · "}
                Fees {fmtMoney(trade.fees)}
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Main grid                                                         */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">

          {/* ================================================================ */}
          {/* LEFT                                                              */}
          {/* ================================================================ */}

          <div className="space-y-5">

            {/* Entry & Exit */}
            <SectionCard
              title="Entry & Exit"
              description="Execution details for this position."
              icon={<ArrowUpRight size={16} />}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Entry */}
                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${SMALL_SHADOW}
                    transition-all duration-300
                    hover:border-zinc-400/80
                  `}
                >
                  <div className="mb-5 flex items-center gap-2">

                    <div
                      className={`
                        flex h-8 w-8
                        items-center justify-center
                        rounded-lg
                        border border-zinc-700/70
                        bg-zinc-900
                        text-white
                        ${SMALL_SHADOW}
                      `}
                    >
                      <ArrowUpRight size={14} />
                    </div>

                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.12em] text-zinc-700"
                        style={numberFontStyle}
                      >
                        Entry
                      </p>

                      <p
                        className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-zinc-400"
                        style={numberFontStyle}
                      >
                        Open position
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <InfoItem
                      label="Entry Price"
                      value={fmtPrice(trade.entry_price)}
                    />

                    <InfoItem
                      label="Entry Date"
                      value={fmtDateTime(trade.entry_time)}
                    />
                  </div>
                </div>

                {/* Exit */}
                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${SMALL_SHADOW}
                    transition-all duration-300
                    hover:border-zinc-400/80
                  `}
                >
                  <div className="mb-5 flex items-center gap-2">

                    <div
                      className="
                        flex h-8 w-8
                        items-center justify-center
                        rounded-lg
                        border border-zinc-300/70
                        bg-[#eef1f5]
                        text-zinc-600
                        shadow-[inset_3px_3px_7px_rgba(163,177,198,0.16),inset_-3px_-3px_7px_rgba(255,255,255,0.9)]
                      "
                    >
                      <ArrowDownRight size={14} />
                    </div>

                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.12em] text-zinc-700"
                        style={numberFontStyle}
                      >
                        Exit
                      </p>

                      <p
                        className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-zinc-400"
                        style={numberFontStyle}
                      >
                        Close position
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <InfoItem
                      label="Exit Price"
                      value={fmtPrice(trade.exit_price)}
                    />

                    <InfoItem
                      label="Exit Date"
                      value={fmtDateTime(trade.exit_time)}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Risk Management */}
            <SectionCard
              title="Risk Management"
              description="Planned levels and position structure."
              icon={<ShieldAlert size={16} />}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${SMALL_SHADOW}
                    transition-all duration-300
                    hover:border-zinc-400/80
                  `}
                >
                  <InfoItem
                    label="Entry"
                    value={fmtPrice(trade.entry_price)}
                  />
                </div>

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${SMALL_SHADOW}
                    transition-all duration-300
                    hover:border-green-600/60
                    hover:shadow-[0_0_16px_rgba(21,128,61,0.22)]
                  `}
                >
                  <InfoItem
                    label="Take Profit"
                    value={fmtPrice(trade.take_profit)}
                    valueClassName="text-green-700"
                    icon={<Target size={12} />}
                  />
                </div>

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${SMALL_SHADOW}
                    transition-all duration-300
                    hover:border-red-600/60
                    hover:shadow-[0_0_16px_rgba(185,28,28,0.22)]
                  `}
                >
                  <InfoItem
                    label="Stop Loss"
                    value={fmtPrice(trade.stop_loss)}
                    valueClassName="text-red-700"
                    icon={<ShieldAlert size={12} />}
                  />
                </div>
              </div>

              {riskReward !== null && (
                <div
                  className={`
                    mt-4
                    flex items-center justify-between
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    px-4 py-3.5
                    ${SMALL_SHADOW}
                  `}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.12em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    Risk / Reward
                  </span>

                  <span
                    className="text-sm text-zinc-800"
                    style={numberFontStyle}
                  >
                    1 : {riskReward.toFixed(2)}
                  </span>
                </div>
              )}
            </SectionCard>

            {/* Journal */}
            <SectionCard
              title="Journal"
              description="Your reasoning, setup and lessons from the trade."
              icon={<FileText size={16} />}
            >
              <div className="space-y-4">

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${INSET_SHADOW}
                  `}
                >
                  <p
                    className="mb-2 text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    Setup
                  </p>

                  <p
                    className="text-sm leading-6 text-zinc-800"
                    style={numberFontStyle}
                  >
                    {trade.setup?.trim()
                      ? trade.setup
                      : "No setup recorded."}
                  </p>
                </div>

                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${INSET_SHADOW}
                  `}
                >
                  <p
                    className="mb-2 text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    Lesson / Notes
                  </p>

                  <p
                    className="whitespace-pre-wrap text-sm leading-6 text-zinc-700"
                    style={numberFontStyle}
                  >
                    {trade.lesson?.trim()
                      ? trade.lesson
                      : "No lesson or notes recorded."}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ================================================================ */}
          {/* RIGHT                                                             */}
          {/* ================================================================ */}

          <div className="space-y-5 lg:sticky lg:top-5 lg:self-start">

            {/* Performance */}
            <SectionCard
              title="Performance"
              description="Financial result and trade quality."
              icon={<DollarSign size={16} />}
            >
              <div className="space-y-3">

                {/* Gross P&L */}
                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-4
                    ${SMALL_SHADOW}
                    transition-all duration-300
                    ${pnlHoverClass(isProfit)}
                  `}
                >
                  <p
                    className="mb-2 text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    Gross P&L
                  </p>

                  <p
                    className="text-2xl"
                    style={{
                      ...numberFontStyle,
                      color: isProfit
                        ? PROFIT_COLOR
                        : LOSS_COLOR,
                    }}
                  >
                    {isProfit ? "+" : "-"}
                    {fmtMoney(Math.abs(toNum(trade.pnl)))}
                  </p>
                </div>

                {/* Fees */}
                <div
                  className={`
                    flex items-center justify-between
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    px-4 py-3.5
                    ${SMALL_SHADOW}
                  `}
                >
                  <span
                    className="text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    Fees
                  </span>

                  <span
                    className="text-sm text-zinc-700"
                    style={numberFontStyle}
                  >
                    {fmtMoney(trade.fees)}
                  </span>
                </div>

                {/* Net */}
                <div
                  className={`
                    flex items-center justify-between
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    px-4 py-4
                    ${SMALL_SHADOW}
                    transition-all duration-300
                    ${pnlHoverClass(isProfit)}
                  `}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.12em] text-zinc-500"
                    style={numberFontStyle}
                  >
                    Net P&L
                  </span>

                  <span
                    className="text-lg"
                    style={{
                      ...numberFontStyle,
                      color: isProfit
                        ? PROFIT_COLOR
                        : LOSS_COLOR,
                    }}
                  >
                    {isProfit ? "+" : "-"}
                    {fmtMoney(Math.abs(netPnl))}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Score */}
            <SectionCard
              title="Trade Score"
              description="Your rating for this trade."
              icon={<Check size={16} />}
            >
              {trade.score !== null ? (
                <div
                  className={`
                    rounded-2xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    p-5
                    ${SMALL_SHADOW}
                  `}
                >
                  <div className="flex items-end justify-between">

                    <div>
                      <p
                        className="text-[9px] uppercase tracking-[0.12em] text-zinc-400"
                        style={numberFontStyle}
                      >
                        Execution Score
                      </p>

                      <p
                        className="mt-2 text-4xl text-zinc-900"
                        style={numberFontStyle}
                      >
                        {trade.score}
                        <span className="ml-1 text-base text-zinc-300">
                          / 10
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className={[
                            "h-7 w-1.5 rounded-full transition-all duration-300",
                            index < trade.score!
                              ? "bg-zinc-800 shadow-[0_0_7px_rgba(24,24,27,0.18)]"
                              : "bg-zinc-300",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`
                    rounded-2xl
                    border border-dashed border-zinc-300/70
                    bg-[#eef1f5]
                    px-4 py-6
                    text-center
                    ${INSET_SHADOW}
                  `}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.12em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    No score recorded
                  </p>
                </div>
              )}
            </SectionCard>

            {/* Trade Details */}
            <SectionCard
              title="Trade Details"
              description="Additional information about this record."
            >
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                <InfoItem
                  label="Symbol"
                  value={trade.symbol}
                />

                <InfoItem
                  label="Direction"
                  value={trade.direction}
                  valueClassName={
                    trade.direction === "LONG"
                      ? "text-green-700"
                      : "text-red-700"
                  }
                />

                <InfoItem
                  label="Lots"
                  value={fmtMoney(trade.lots)}
                />

                <InfoItem
                  label="Created"
                  value={fmtDate(trade.created_at)}
                />

                <InfoItem
                  label="Updated"
                  value={fmtDate(trade.updated_at)}
                />

                <InfoItem
                  label="Status"
                  value={
                    trade.exit_time && trade.exit_price
                      ? "Closed"
                      : "Open"
                  }
                />
              </div>
            </SectionCard>

            {/* Actions */}
            <div
              className={`
                rounded-[24px]
                border border-zinc-300/70
                bg-[#eef1f5]
                p-4
                ${CARD_SHADOW}
              `}
            >
              <div className="flex flex-col gap-2">

                {/* Edit */}
                <Link
                  href={`/trades/${trade.id}/edit`}
                  className="
                    flex h-11
                    items-center justify-center gap-2
                    rounded-xl
                    border border-zinc-700/70
                    bg-zinc-900
                    text-[10px]
                    uppercase
                    tracking-[0.13em]
                    text-white
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-green-600/70
                    hover:bg-zinc-900
                    hover:shadow-[8px_8px_18px_rgba(163,177,198,0.28),-7px_-7px_16px_rgba(255,255,255,0.85),0_0_18px_rgba(21,128,61,0.58),0_7px_32px_rgba(21,128,61,0.42)]
                  "
                  style={numberFontStyle}
                >
                  <Pencil size={14} />
                  Edit Trade
                </Link>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="
                    flex h-11
                    items-center justify-center gap-2
                    rounded-xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    text-[10px]
                    uppercase
                    tracking-[0.13em]
                    text-zinc-500
                    transition-all duration-300
                    shadow-[5px_5px_12px_rgba(163,177,198,0.18),-5px_-5px_12px_rgba(255,255,255,0.85)]
                    hover:-translate-y-0.5
                    hover:border-red-600/70
                    hover:text-red-700
                    hover:shadow-[6px_6px_15px_rgba(163,177,198,0.20),-6px_-6px_15px_rgba(255,255,255,0.9),0_0_16px_rgba(185,28,28,0.50),0_6px_26px_rgba(185,28,28,0.30)]
                  "
                  style={numberFontStyle}
                >
                  <Trash2 size={14} />
                  Delete Trade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Delete Modal                                                      */}
        {/* ---------------------------------------------------------------- */}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/25 px-4 backdrop-blur-sm">

            <div
              className={`
                w-full max-w-[430px]
                rounded-[24px]
                border border-zinc-300/70
                bg-[#eef1f5]
                p-6
                ${CARD_SHADOW}
              `}
            >
              <div className="mb-5 flex items-start justify-between">

                <div>
                  <div
                    className="
                      mb-3
                      flex h-9 w-9
                      items-center justify-center
                      rounded-xl
                      border border-red-200/80
                      bg-[#eef1f5]
                      text-red-600
                      shadow-[inset_3px_3px_7px_rgba(163,177,198,0.15),inset_-3px_-3px_7px_rgba(255,255,255,0.9)]
                    "
                  >
                    <Trash2 size={16} />
                  </div>

                  <h2
                    className="text-xl text-zinc-900"
                    style={displayFontStyle}
                  >
                    Delete Trade?
                  </h2>

                  <p
                    className="mt-2 text-xs leading-5 text-zinc-400"
                    style={numberFontStyle}
                  >
                    This will permanently remove the{" "}
                    <span className="text-zinc-700">
                      {trade.symbol}
                    </span>{" "}
                    trade from your journal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-lg
                    border border-transparent
                    text-zinc-400
                    transition-all duration-300
                    hover:border-zinc-300/70
                    hover:bg-[#eef1f5]
                    hover:text-zinc-700
                  "
                >
                  <X size={16} />
                </button>
              </div>

              {/* Trade preview */}
              <div
                className={`
                  mb-5
                  rounded-2xl
                  border border-zinc-300/70
                  bg-[#eef1f5]
                  p-4
                  ${INSET_SHADOW}
                  transition-all duration-300
                  ${pnlHoverClass(isProfit)}
                `}
              >
                <div className="flex items-center justify-between">

                  <span
                    className="text-[10px] uppercase tracking-[0.12em] text-zinc-400"
                    style={numberFontStyle}
                  >
                    {trade.symbol}
                  </span>

                  <span
                    className="text-sm"
                    style={{
                      ...numberFontStyle,
                      color: isProfit
                        ? PROFIT_COLOR
                        : LOSS_COLOR,
                    }}
                  >
                    {isProfit ? "+" : "-"}
                    {fmtMoney(Math.abs(netPnl))}
                  </span>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="
                    h-10
                    rounded-xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    px-5
                    text-[10px]
                    uppercase
                    tracking-[0.12em]
                    text-zinc-500
                    transition-all duration-300
                    shadow-[5px_5px_12px_rgba(163,177,198,0.18),-5px_-5px_12px_rgba(255,255,255,0.85)]
                    hover:border-zinc-400
                    hover:text-zinc-800
                    disabled:opacity-50
                  "
                  style={numberFontStyle}
                >
                  Cancel
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="
                    flex h-10
                    items-center justify-center gap-2
                    rounded-xl
                    border border-red-700/70
                    bg-red-700
                    px-5
                    text-[10px]
                    uppercase
                    tracking-[0.12em]
                    text-white
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-red-600
                    hover:bg-red-700
                    hover:shadow-[7px_7px_16px_rgba(163,177,198,0.22),-6px_-6px_14px_rgba(255,255,255,0.7),0_0_18px_rgba(185,28,28,0.58),0_7px_28px_rgba(185,28,28,0.38)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  style={numberFontStyle}
                >
                  {deleting ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete Trade
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}