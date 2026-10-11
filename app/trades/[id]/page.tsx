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

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

const FONT_DISPLAY = "var(--font-space-grotesk), sans-serif";
const FONT_NUMBERS = "var(--font-inter), sans-serif";

const BG = "#121026";
const PANEL = "#191531";
const INNER_PANEL = "#15122b";
const INSET = "#131027";

const VIOLET = "#c4b5fd";
const PROFIT_COLOR = "#4ade80";
const LOSS_COLOR = "#fb7185";

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

const displayFontStyle = {
  fontFamily: FONT_DISPLAY,
  letterSpacing: "-0.035em",
} as const;

const numberFontStyle = {
  fontFamily: FONT_NUMBERS,
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "0.035em",
} as const;

const LABEL_CLASS =
  "text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400";

/* -------------------------------------------------------------------------- */
/* Neumorphic surfaces                                                        */
/* -------------------------------------------------------------------------- */

const CARD_SHADOW =
  "shadow-[8px_8px_20px_rgba(5,4,18,0.48),-3px_-3px_14px_rgba(139,92,246,0.07),inset_1px_1px_0_rgba(255,255,255,0.035)]";

const SMALL_SHADOW =
  "shadow-[5px_5px_12px_rgba(5,4,18,0.38),-2px_-2px_10px_rgba(139,92,246,0.06),inset_1px_1px_0_rgba(255,255,255,0.025)]";

const INSET_SHADOW =
  "shadow-[inset_4px_4px_10px_rgba(5,4,18,0.42),inset_-2px_-2px_8px_rgba(139,92,246,0.055)]";

const PANEL_CLASS =
  "border border-violet-300/25 bg-[#191531]";

const INNER_PANEL_CLASS =
  "border border-violet-300/20 bg-[#15122b]";

const CARD_HOVER =
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-300/50 hover:shadow-[0_0_0_1px_rgba(167,139,250,0.08),0_0_25px_rgba(139,92,246,0.12),8px_8px_20px_rgba(5,4,18,0.45)]";

const SMALL_HOVER =
  "transition-all duration-300 ease-out hover:border-violet-300/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.09)]";

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
  return toNum(value).toLocaleString("en-US", {
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

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDateTime(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return `${fmtDate(value)} · ${fmtTime(value)}`;
}

function pnlHoverClass(positive: boolean): string {
  return positive
    ? "hover:border-green-400/70 hover:shadow-[0_0_0_1px_rgba(74,222,128,0.12),0_0_24px_rgba(74,222,128,0.13),8px_8px_20px_rgba(5,4,18,0.45)]"
    : "hover:border-rose-400/70 hover:shadow-[0_0_0_1px_rgba(251,113,133,0.12),0_0_24px_rgba(251,113,133,0.13),8px_8px_20px_rgba(5,4,18,0.45)]";
}

/* -------------------------------------------------------------------------- */
/* Reusable components                                                        */
/* -------------------------------------------------------------------------- */

function GradientHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r from-white via-violet-100 to-violet-300 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}

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
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-1.5">
        {icon && (
          <span className="shrink-0 text-violet-300/80">{icon}</span>
        )}

        <span className={LABEL_CLASS} style={numberFontStyle}>
          {label}
        </span>
      </div>

      <p
        className={`break-words text-sm font-medium text-slate-200 ${valueClassName}`}
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
      className={`rounded-[24px] ${PANEL_CLASS} bg-gradient-to-br from-[#1b1735] via-[#191531] to-[#151229] p-5 ${CARD_SHADOW} ${CARD_HOVER} sm:p-6`}
    >
      <div className="mb-6 flex items-start gap-3">
        {icon && (
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/25 bg-[#17132e] text-violet-200 ${SMALL_SHADOW}`}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h2
            className="text-[17px] font-semibold tracking-[-0.025em] sm:text-[18px]"
            style={displayFontStyle}
          >
            <GradientHeading>{title}</GradientHeading>
          </h2>

          {description && (
            <p
              className="mt-1.5 text-[11px] leading-5 tracking-[0.035em] text-slate-400"
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

function InnerCard({
  children,
  className = "",
  inset = false,
}: {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl ${INNER_PANEL_CLASS} ${
        inset ? INSET_SHADOW : SMALL_SHADOW
      } ${inset ? "" : SMALL_HOVER} ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load trade                                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("A valid trade ID was not provided.");
      return;
    }

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

  const isClosed = Boolean(trade?.exit_time && trade?.exit_price);

  const riskReward = useMemo(() => {
    if (!trade) return null;

    const entry = toNum(trade.entry_price);
    const tp = toNum(trade.take_profit);
    const sl = toNum(trade.stop_loss);

    if (!entry || !tp || !sl) return null;

    const reward =
      trade.direction === "LONG"
        ? Math.abs(tp - entry)
        : Math.abs(entry - tp);

    const risk =
      trade.direction === "LONG"
        ? Math.abs(entry - sl)
        : Math.abs(sl - entry);

    if (!risk) return null;

    return reward / risk;
  }, [trade]);

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleDelete() {
    if (!trade || deleting) return;

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
        className="flex min-h-screen items-center justify-center bg-[#121026] px-4"
        style={{ fontFamily: FONT_NUMBERS }}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl ${PANEL_CLASS} px-5 py-4 ${CARD_SHADOW}`}
        >
          <Loader2 size={17} className="animate-spin text-violet-300" />

          <span className={LABEL_CLASS} style={numberFontStyle}>
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
        className="min-h-screen bg-[#121026] px-4 py-8 sm:px-6 lg:px-8"
        style={{ fontFamily: FONT_NUMBERS }}
      >
        <div className="mx-auto max-w-[1180px]">
          <Link
            href="/trades"
            className="mb-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 transition-all duration-300 hover:-translate-x-0.5 hover:text-violet-200"
            style={numberFontStyle}
          >
            <ArrowLeft size={15} />
            Back to Trades
          </Link>

          <div
            className={`rounded-[24px] ${PANEL_CLASS} bg-gradient-to-br from-[#1c1737] to-[#151229] p-8 text-center ${CARD_SHADOW} transition-all duration-300 hover:border-rose-300/50 hover:shadow-[0_0_25px_rgba(251,113,133,0.10)]`}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-300/30 bg-rose-400/10 text-rose-300">
              <X size={20} />
            </div>

            <h1
              className="text-xl font-semibold tracking-[-0.035em]"
              style={displayFontStyle}
            >
              <GradientHeading>Trade Not Found</GradientHeading>
            </h1>

            <p
              className="mx-auto mt-3 max-w-md text-xs leading-6 tracking-[0.025em] text-slate-400"
              style={numberFontStyle}
            >
              {error || "The requested trade could not be found."}
            </p>

            <Link
              href="/trades"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-300/40 bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200/70 hover:shadow-[0_0_22px_rgba(139,92,246,0.3)]"
              style={numberFontStyle}
            >
              <ArrowLeft size={14} />
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
      className="min-h-screen bg-[#121026] px-4 py-5 text-slate-200 sm:px-6 sm:py-6 lg:px-8"
      style={{ fontFamily: FONT_NUMBERS }}
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Back */}

        <Link
          href="/trades"
          className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 transition-all duration-300 hover:-translate-x-0.5 hover:text-violet-200"
          style={numberFontStyle}
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Back to Trades
        </Link>

        {/* Hero */}

        <section
          className={`relative mb-5 overflow-hidden rounded-[26px] border ${
            isProfit ? "border-green-300/25" : "border-rose-300/25"
          } bg-gradient-to-br from-[#1d183b] via-[#191531] to-[#141129] p-5 ${CARD_SHADOW} transition-all duration-300 hover:-translate-y-0.5 ${
            isProfit
              ? "hover:border-green-300/50 hover:shadow-[0_0_28px_rgba(74,222,128,0.09),8px_8px_20px_rgba(5,4,18,0.45)]"
              : "hover:border-rose-300/50 hover:shadow-[0_0_28px_rgba(251,113,133,0.09),8px_8px_20px_rgba(5,4,18,0.45)]"
          } sm:p-7`}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full opacity-[0.12] blur-[85px]"
            style={{
              backgroundColor: isProfit ? PROFIT_COLOR : LOSS_COLOR,
            }}
          />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-64 rounded-full bg-violet-600/10 blur-[80px]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Trade information */}

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] ${
                    trade.direction === "LONG"
                      ? "border-green-300/30 bg-green-400/[0.07] text-green-300"
                      : "border-rose-300/30 bg-rose-400/[0.07] text-rose-300"
                  }`}
                  style={numberFontStyle}
                >
                  {trade.direction === "LONG" ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {trade.direction}
                </span>

                <span
                  className={`rounded-lg border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] ${
                    isClosed
                      ? "border-violet-300/25 bg-violet-400/[0.06] text-violet-200"
                      : "border-amber-300/30 bg-amber-400/[0.06] text-amber-300"
                  }`}
                  style={numberFontStyle}
                >
                  {isClosed ? "Closed" : "Open"}
                </span>
              </div>

              <h1
                className="break-words bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-3xl font-bold tracking-[-0.045em] text-transparent sm:text-4xl"
                style={displayFontStyle}
              >
                {trade.symbol}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CalendarDays size={13} className="text-violet-300/80" />

                  <span
                    className="text-[10px] uppercase tracking-[0.10em]"
                    style={numberFontStyle}
                  >
                    {fmtDate(trade.entry_time)}
                  </span>
                </div>

                <span className="h-1 w-1 rounded-full bg-violet-300/40" />

                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock3 size={13} className="text-violet-300/80" />

                  <span
                    className="text-[10px] uppercase tracking-[0.10em]"
                    style={numberFontStyle}
                  >
                    {fmtTime(trade.entry_time)}
                  </span>
                </div>

                <span className="h-1 w-1 rounded-full bg-violet-300/40" />

                <span
                  className="text-[10px] uppercase tracking-[0.10em] text-slate-400"
                  style={numberFontStyle}
                >
                  {fmtMoney(trade.lots, 2)} lots
                </span>
              </div>
            </div>

            {/* Net P&L */}

            <div className="rounded-2xl border border-white/[0.06] bg-[#121026]/45 px-5 py-4 lg:min-w-[245px] lg:text-right">
              <p className={LABEL_CLASS} style={numberFontStyle}>
                Net P&amp;L
              </p>

              <div
                className="mt-2 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl"
                style={{
                  ...numberFontStyle,
                  letterSpacing: "-0.045em",
                  color: isProfit ? PROFIT_COLOR : LOSS_COLOR,
                  textShadow: isProfit
                    ? "0 0 24px rgba(74,222,128,0.18)"
                    : "0 0 24px rgba(251,113,133,0.18)",
                }}
              >
                {netPnl > 0 ? "+" : netPnl < 0 ? "−" : ""}
                {fmtMoney(Math.abs(netPnl))}
              </div>

              <p
                className="mt-2 text-[9px] uppercase tracking-[0.10em] text-slate-400"
                style={numberFontStyle}
              >
                Gross {toNum(trade.pnl) > 0 ? "+" : ""}
                {fmtMoney(trade.pnl)}
                <span className="mx-1.5 text-violet-300/40">·</span>
                Fees {fmtMoney(trade.fees)}
              </p>
            </div>
          </div>
        </section>

        {/* Main grid */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* LEFT COLUMN */}

          <div className="space-y-5">
            {/* Entry and exit */}

            <SectionCard
              title="Entry & Exit"
              description="Execution details for this position."
              icon={<ArrowUpRight size={16} />}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InnerCard className="p-4">
                  <div className="mb-5 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-green-300/25 bg-green-400/[0.08] text-green-300">
                      <ArrowUpRight size={15} />
                    </div>

                    <div>
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.15em] text-green-200"
                        style={numberFontStyle}
                      >
                        Entry
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">
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
                </InnerCard>

                <InnerCard className="p-4">
                  <div className="mb-5 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/25 bg-violet-400/[0.08] text-violet-200">
                      <ArrowDownRight size={15} />
                    </div>

                    <div>
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.15em] text-violet-200"
                        style={numberFontStyle}
                      >
                        Exit
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">
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
                </InnerCard>
              </div>
            </SectionCard>

            {/* Risk management */}

            <SectionCard
              title="Risk Management"
              description="Planned levels and position structure."
              icon={<ShieldAlert size={16} />}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InnerCard className="p-4">
                  <InfoItem
                    label="Entry"
                    value={fmtPrice(trade.entry_price)}
                  />
                </InnerCard>

                <InnerCard className="p-4 transition-all duration-300 hover:border-green-300/40 hover:shadow-[0_0_20px_rgba(74,222,128,0.08)]">
                  <InfoItem
                    label="Take Profit"
                    value={fmtPrice(trade.take_profit)}
                    valueClassName="text-green-300"
                    icon={<Target size={12} />}
                  />
                </InnerCard>

                <InnerCard className="p-4 transition-all duration-300 hover:border-rose-300/40 hover:shadow-[0_0_20px_rgba(251,113,133,0.08)]">
                  <InfoItem
                    label="Stop Loss"
                    value={fmtPrice(trade.stop_loss)}
                    valueClassName="text-rose-300"
                    icon={<ShieldAlert size={12} />}
                  />
                </InnerCard>
              </div>

              {riskReward !== null && (
                <div
                  className={`mt-4 flex items-center justify-between rounded-2xl ${INNER_PANEL_CLASS} px-4 py-3.5 ${SMALL_SHADOW}`}
                >
                  <span className={LABEL_CLASS} style={numberFontStyle}>
                    Risk / Reward
                  </span>

                  <span
                    className="text-sm font-semibold tracking-[0.04em] text-violet-200"
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
                <InnerCard inset className="p-4">
                  <p className={`mb-2 ${LABEL_CLASS}`} style={numberFontStyle}>
                    Setup
                  </p>

                  <p
                    className="whitespace-pre-wrap text-sm leading-6 tracking-[0.015em] text-slate-200"
                    style={numberFontStyle}
                  >
                    {trade.setup?.trim() || "No setup recorded."}
                  </p>
                </InnerCard>

                <InnerCard inset className="p-4">
                  <p className={`mb-2 ${LABEL_CLASS}`} style={numberFontStyle}>
                    Lesson / Notes
                  </p>

                  <p
                    className="whitespace-pre-wrap text-sm leading-6 tracking-[0.015em] text-slate-300"
                    style={numberFontStyle}
                  >
                    {trade.lesson?.trim() || "No lesson or notes recorded."}
                  </p>
                </InnerCard>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-5 lg:sticky lg:top-5 lg:self-start">
            {/* Performance */}

            <SectionCard
              title="Performance"
              description="Financial result and trade quality."
              icon={<DollarSign size={16} />}
            >
              <div className="space-y-3">
                <InnerCard
                  className={`p-4 ${pnlHoverClass(toNum(trade.pnl) >= 0)}`}
                >
                  <p className={LABEL_CLASS} style={numberFontStyle}>
                    Gross P&amp;L
                  </p>

                  <p
                    className="mt-2 text-2xl font-semibold tracking-[-0.035em]"
                    style={{
                      ...numberFontStyle,
                      letterSpacing: "-0.035em",
                      color: toNum(trade.pnl) >= 0 ? PROFIT_COLOR : LOSS_COLOR,
                    }}
                  >
                    {toNum(trade.pnl) > 0
                      ? "+"
                      : toNum(trade.pnl) < 0
                        ? "−"
                        : ""}
                    {fmtMoney(Math.abs(toNum(trade.pnl)))}
                  </p>
                </InnerCard>

                <div
                  className={`flex items-center justify-between rounded-2xl ${INNER_PANEL_CLASS} px-4 py-3.5 ${SMALL_SHADOW}`}
                >
                  <span className={LABEL_CLASS} style={numberFontStyle}>
                    Fees
                  </span>

                  <span
                    className="text-sm font-medium text-slate-300"
                    style={numberFontStyle}
                  >
                    {fmtMoney(trade.fees)}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${SMALL_SHADOW} ${pnlHoverClass(isProfit)} ${
                    isProfit
                      ? "border-green-300/25 bg-green-400/[0.035]"
                      : "border-rose-300/25 bg-rose-400/[0.035]"
                  }`}
                >
                  <span className={LABEL_CLASS} style={numberFontStyle}>
                    Net P&amp;L
                  </span>

                  <span
                    className="text-lg font-semibold tracking-[-0.025em]"
                    style={{
                      ...numberFontStyle,
                      letterSpacing: "-0.025em",
                      color: isProfit ? PROFIT_COLOR : LOSS_COLOR,
                    }}
                  >
                    {netPnl > 0 ? "+" : netPnl < 0 ? "−" : ""}
                    {fmtMoney(Math.abs(netPnl))}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Trade score */}

            <SectionCard
              title="Trade Score"
              description="Your rating for this trade."
              icon={<Check size={16} />}
            >
              {trade.score !== null && trade.score !== undefined ? (
                <InnerCard className="p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className={LABEL_CLASS} style={numberFontStyle}>
                        Execution Score
                      </p>

                      <p
                        className="mt-2 text-4xl font-semibold tracking-[-0.05em]"
                        style={displayFontStyle}
                      >
                        <GradientHeading>{trade.score}</GradientHeading>

                        <span className="ml-1 text-base font-normal tracking-normal text-slate-500">
                          / 10
                        </span>
                      </p>
                    </div>

                    <div
                      className="flex gap-1"
                      aria-label={`Score ${trade.score} out of 10`}
                    >
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className={`h-7 w-1.5 rounded-full transition-all duration-300 ${
                            index < Number(trade.score)
                              ? "bg-gradient-to-t from-violet-600 to-fuchsia-300 shadow-[0_0_8px_rgba(167,139,250,0.25)]"
                              : "bg-violet-200/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </InnerCard>
              ) : (
                <div
                  className={`rounded-2xl border border-dashed border-violet-300/20 bg-[#131027] px-4 py-7 text-center ${INSET_SHADOW}`}
                >
                  <p className={LABEL_CLASS} style={numberFontStyle}>
                    No score recorded
                  </p>
                </div>
              )}
            </SectionCard>

            {/* Trade details */}

            <SectionCard
              title="Trade Details"
              description="Additional information about this record."
            >
              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                <InfoItem label="Symbol" value={trade.symbol} />

                <InfoItem
                  label="Direction"
                  value={trade.direction}
                  valueClassName={
                    trade.direction === "LONG"
                      ? "text-green-300"
                      : "text-rose-300"
                  }
                />

                <InfoItem label="Lots" value={fmtMoney(trade.lots)} />

                <InfoItem label="Created" value={fmtDate(trade.created_at)} />

                <InfoItem label="Updated" value={fmtDate(trade.updated_at)} />

                <InfoItem
                  label="Status"
                  value={isClosed ? "Closed" : "Open"}
                  valueClassName={
                    isClosed ? "text-violet-200" : "text-amber-300"
                  }
                />
              </div>
            </SectionCard>

            {/* Actions */}

            <div
              className={`rounded-[24px] ${PANEL_CLASS} bg-gradient-to-br from-[#1b1735] to-[#151229] p-4 ${CARD_SHADOW}`}
            >
              <div className="flex flex-col gap-3">
                <Link
                  href={`/trades/${trade.id}/edit`}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-300/40 bg-gradient-to-r from-violet-600 to-purple-600 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200/70 hover:from-violet-500 hover:to-fuchsia-600 hover:shadow-[0_0_24px_rgba(139,92,246,0.27)]"
                  style={numberFontStyle}
                >
                  <Pencil size={14} />
                  Edit Trade
                </Link>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-rose-400/[0.04] text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/60 hover:bg-rose-400/[0.08] hover:shadow-[0_0_22px_rgba(251,113,133,0.12)]"
                  style={numberFontStyle}
                >
                  <Trash2 size={14} />
                  Delete Trade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete confirmation modal */}

        {showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080716]/75 px-4 py-6 backdrop-blur-md"
            onClick={(event) => {
              if (event.target === event.currentTarget && !deleting) {
                setShowDeleteModal(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-trade-title"
              className={`w-full max-w-[430px] rounded-[24px] ${PANEL_CLASS} bg-gradient-to-br from-[#211938] via-[#191531] to-[#141129] p-6 ${CARD_SHADOW}`}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-rose-300/30 bg-rose-400/[0.08] text-rose-300">
                    <Trash2 size={17} />
                  </div>

                  <h2
                    id="delete-trade-title"
                    className="text-xl font-semibold tracking-[-0.035em]"
                    style={displayFontStyle}
                  >
                    <GradientHeading>Delete Trade?</GradientHeading>
                  </h2>

                  <p
                    className="mt-2 text-xs leading-6 tracking-[0.02em] text-slate-400"
                    style={numberFontStyle}
                  >
                    This will permanently remove the{" "}
                    <span className="font-semibold text-violet-200">
                      {trade.symbol}
                    </span>{" "}
                    trade from your journal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  aria-label="Close delete confirmation"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-400 transition-all duration-300 hover:border-violet-300/25 hover:bg-violet-400/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Trade preview */}

              <div
                className={`mb-5 rounded-2xl border ${INNER_PANEL_CLASS} p-4 ${INSET_SHADOW} ${pnlHoverClass(isProfit)}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200"
                      style={numberFontStyle}
                    >
                      {trade.symbol}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">
                      {trade.direction} · {fmtMoney(trade.lots, 2)} lots
                    </p>
                  </div>

                  <span
                    className="text-sm font-semibold"
                    style={{
                      ...numberFontStyle,
                      color: isProfit ? PROFIT_COLOR : LOSS_COLOR,
                    }}
                  >
                    {netPnl > 0 ? "+" : netPnl < 0 ? "−" : ""}
                    {fmtMoney(Math.abs(netPnl))}
                  </span>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="h-10 rounded-xl border border-violet-300/25 bg-[#15122b] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300 transition-all duration-300 hover:border-violet-300/50 hover:bg-violet-400/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  style={numberFontStyle}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-300/40 bg-gradient-to-r from-rose-600 to-red-600 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-200/70 hover:from-rose-500 hover:to-red-500 hover:shadow-[0_0_22px_rgba(251,113,133,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                  style={numberFontStyle}
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
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
