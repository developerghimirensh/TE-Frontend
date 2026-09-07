"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { createTrade, type TradeInput } from "@/lib/api";

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
const LOSS_COLOR = "#b91c1c";

/* -------------------------------------------------------------------------- */
/* Neumorphism Shadows                                                        */
/* -------------------------------------------------------------------------- */

const neutralShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.20),-8px_-8px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.25),-10px_-10px_24px_rgba(255,255,255,1)]";

const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.16),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]";

const insetShadowFocus =
  "focus:shadow-[inset_6px_6px_14px_rgba(163,177,198,0.22),inset_-6px_-6px_14px_rgba(255,255,255,0.95)]";

const profitShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.18),-8px_-8px_18px_rgba(255,255,255,0.95),0_4px_16px_rgba(21,128,61,0.12)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.22),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(21,128,61,0.28)]";

const lossShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.18),-8px_-8px_18px_rgba(255,255,255,0.95),0_4px_16px_rgba(185,28,28,0.12)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.22),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(185,28,28,0.28)]";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getLocalDateTime(): string {
  const now = new Date();

  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
}

function InputLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      className="mb-2 block text-[9px] font-normal uppercase tracking-[0.12em] text-zinc-400"
      style={numberFontStyle}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Input classes                                                              */
/* -------------------------------------------------------------------------- */

const inputClass = [
  "h-11 w-full rounded-xl bg-[#eef1f5] px-3.5",
  "text-sm font-normal text-zinc-800",
  "outline-none",
  "transition-all duration-300",
  "placeholder:text-zinc-400",
  insetShadow,
].join(" ");

const textareaClass = [
  "w-full rounded-xl bg-[#eef1f5] px-3.5 py-3",
  "text-sm font-normal leading-6 text-zinc-800",
  "outline-none resize-none",
  "placeholder:text-zinc-400",
  "transition-all duration-300",
  insetShadow,
].join(" ");

/* -------------------------------------------------------------------------- */
/* Section Card                                                               */
/* -------------------------------------------------------------------------- */

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "rounded-[24px] bg-[#eef1f5] p-5 sm:p-6",
        "transition-all duration-300",
        neutralShadow,
      ].join(" ")}
    >
      <div className="mb-6">
        <h2
          className="text-[18px] font-normal text-zinc-900"
          style={displayFontStyle}
        >
          {title}
        </h2>

        {description && (
          <p
            className="mt-1.5 text-xs font-normal text-zinc-400"
            style={numberFontStyle}
          >
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function NewTradePage() {
  const router = useRouter();

  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [lots, setLots] = useState("");

  const [entryTime, setEntryTime] = useState(getLocalDateTime());
  const [exitTime, setExitTime] = useState("");

  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");

  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");

  const [pnl, setPnl] = useState("");
  const [fees, setFees] = useState("0");
  const [score, setScore] = useState("");

  const [setup, setSetup] = useState("");
  const [lesson, setLesson] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Validation                                                               */
  /* ------------------------------------------------------------------------ */

  const validationMessage = useMemo(() => {
    if (!symbol.trim()) {
      return "Symbol is required.";
    }

    if (!lots || Number(lots) <= 0) {
      return "Lots must be greater than 0.";
    }

    if (!entryPrice || Number(entryPrice) <= 0) {
      return "Entry price must be greater than 0.";
    }

    if (exitTime && entryTime) {
      const entry = new Date(entryTime).getTime();
      const exit = new Date(exitTime).getTime();

      if (exit < entry) {
        return "Exit time cannot be before entry time.";
      }
    }

    if (takeProfit) {
      const tp = Number(takeProfit);
      const entry = Number(entryPrice);

      if (direction === "LONG" && tp <= entry) {
        return "For a LONG trade, take profit must be above entry price.";
      }

      if (direction === "SHORT" && tp >= entry) {
        return "For a SHORT trade, take profit must be below entry price.";
      }
    }

    if (stopLoss) {
      const sl = Number(stopLoss);
      const entry = Number(entryPrice);

      if (direction === "LONG" && sl >= entry) {
        return "For a LONG trade, stop loss must be below entry price.";
      }

      if (direction === "SHORT" && sl <= entry) {
        return "For a SHORT trade, stop loss must be above entry price.";
      }
    }

    if (fees && Number(fees) < 0) {
      return "Fees cannot be negative.";
    }

    if (score) {
      const scoreNumber = Number(score);

      if (
        !Number.isInteger(scoreNumber) ||
        scoreNumber < 1 ||
        scoreNumber > 10
      ) {
        return "Score must be a whole number between 1 and 10.";
      }
    }

    return null;
  }, [
    symbol,
    lots,
    entryPrice,
    entryTime,
    exitTime,
    takeProfit,
    stopLoss,
    direction,
    fees,
    score,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setSaving(true);

      const data: TradeInput = {
        entry_time: new Date(entryTime).toISOString(),

        exit_time: exitTime ? new Date(exitTime).toISOString() : null,

        symbol: symbol.trim().toUpperCase(),

        direction,

        lots,

        entry_price: entryPrice,

        take_profit: takeProfit || null,

        stop_loss: stopLoss || null,

        exit_price: exitPrice || null,

        pnl: pnl || 0,

        fees: fees || 0,

        setup: setup.trim(),

        lesson: lesson.trim(),

        score: score ? Number(score) : null,
      };

      const createdTrade = await createTrade(data);

      router.push(`/trades/${createdTrade.id}`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create trade. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Reset                                                                    */
  /* ------------------------------------------------------------------------ */

  function handleCancel() {
    router.push("/trades");
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-[#eef1f5] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <header className="mb-7">
          <Link
            href="/trades"
            className="mb-5 inline-flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.12em] text-zinc-400 transition-all duration-300 hover:-translate-x-0.5 hover:text-zinc-800"
            style={numberFontStyle}
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Back to Trades
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />

                <span
                  className="text-[10px] font-normal uppercase tracking-[0.16em] text-zinc-400"
                  style={numberFontStyle}
                >
                  Trading Journal
                </span>
              </div>

              <h1
                className="text-[28px] font-normal leading-tight tracking-tight text-zinc-950 sm:text-[34px]"
                style={displayFontStyle}
              >
                New Trade
              </h1>

              <p
                className="mt-2 max-w-xl text-xs font-normal text-zinc-400 sm:text-sm"
                style={numberFontStyle}
              >
                Record your trade, risk management and the lesson behind the
                decision.
              </p>
            </div>

            {/* Direction indicator */}
            <div
              className={[
                "hidden items-center gap-2 rounded-xl bg-[#eef1f5] px-4 py-2.5 sm:flex",
                direction === "LONG" ? profitShadow : lossShadow,
              ].join(" ")}
            >
              {direction === "LONG" ? (
                <TrendingUp
                  size={16}
                  style={{ color: PROFIT_COLOR }}
                  strokeWidth={1.8}
                />
              ) : (
                <TrendingDown
                  size={16}
                  style={{ color: LOSS_COLOR }}
                  strokeWidth={1.8}
                />
              )}

              <span
                className="text-[11px] font-normal uppercase tracking-[0.1em]"
                style={{
                  ...numberFontStyle,
                  color: direction === "LONG" ? PROFIT_COLOR : LOSS_COLOR,
                }}
              >
                {direction} Trade
              </span>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* ------------------------------------------------------------ */}
            {/* Trade Information                                             */}
            {/* ------------------------------------------------------------ */}

            <SectionCard
              title="Trade Information"
              description="Basic details about the position."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Symbol */}
                <div>
                  <InputLabel required>Symbol</InputLabel>

                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="e.g. XAUUSD"
                    autoComplete="off"
                    className={inputClass}
                    style={numberFontStyle}
                  />
                </div>

                {/* Lots */}
                <div>
                  <InputLabel required>Lots</InputLabel>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={lots}
                    onChange={(e) => setLots(e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                    style={numberFontStyle}
                  />
                </div>

                {/* Direction */}
                <div>
                  <InputLabel required>Direction</InputLabel>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDirection("LONG")}
                      className={[
                        "flex h-11 items-center justify-center gap-2 rounded-xl bg-[#eef1f5]",
                        "text-[11px] font-normal uppercase tracking-[0.12em]",
                        "transition-all duration-300",
                        direction === "LONG"
                          ? [insetShadow, "text-green-700"].join(" ")
                          : [neutralShadow, "text-zinc-400"].join(" "),
                      ].join(" ")}
                      style={numberFontStyle}
                    >
                      <TrendingUp size={15} />
                      Long
                    </button>

                    <button
                      type="button"
                      onClick={() => setDirection("SHORT")}
                      className={[
                        "flex h-11 items-center justify-center gap-2 rounded-xl bg-[#eef1f5]",
                        "text-[11px] font-normal uppercase tracking-[0.12em]",
                        "transition-all duration-300",
                        direction === "SHORT"
                          ? [insetShadow, "text-red-700"].join(" ")
                          : [neutralShadow, "text-zinc-400"].join(" "),
                      ].join(" ")}
                      style={numberFontStyle}
                    >
                      <TrendingDown size={15} />
                      Short
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ------------------------------------------------------------ */}
            {/* Entry & Exit                                                   */}
            {/* ------------------------------------------------------------ */}

            <SectionCard
              title="Entry & Exit"
              description="Capture exactly when and where the position was opened and closed."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Entry */}
                <div
                  className={["rounded-2xl bg-[#eef1f5] p-4", insetShadow].join(
                    " ",
                  )}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-500" />

                    <span
                      className="text-[9px] font-normal uppercase tracking-[0.12em] text-zinc-500"
                      style={numberFontStyle}
                    >
                      Entry
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <InputLabel required>Entry Price</InputLabel>

                      <input
                        type="number"
                        min="0"
                        step="0.00001"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        placeholder="0.00000"
                        className={inputClass}
                        style={numberFontStyle}
                      />
                    </div>

                    <div>
                      <InputLabel required>Entry Time</InputLabel>

                      <input
                        type="datetime-local"
                        value={entryTime}
                        onChange={(e) => setEntryTime(e.target.value)}
                        className={inputClass}
                        style={numberFontStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Exit */}
                <div
                  className={["rounded-2xl bg-[#eef1f5] p-4", insetShadow].join(
                    " ",
                  )}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-300" />

                    <span
                      className="text-[9px] font-normal uppercase tracking-[0.12em] text-zinc-500"
                      style={numberFontStyle}
                    >
                      Exit
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <InputLabel>Exit Price</InputLabel>

                      <input
                        type="number"
                        min="0"
                        step="0.00001"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value)}
                        placeholder="0.00000"
                        className={inputClass}
                        style={numberFontStyle}
                      />
                    </div>

                    <div>
                      <InputLabel>Exit Time</InputLabel>

                      <input
                        type="datetime-local"
                        value={exitTime}
                        onChange={(e) => setExitTime(e.target.value)}
                        className={inputClass}
                        style={numberFontStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ------------------------------------------------------------ */}
            {/* Risk Management                                                */}
            {/* ------------------------------------------------------------ */}

            <SectionCard
              title="Risk Management"
              description="Define your planned take profit and stop loss."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Take Profit */}
                <div>
                  <InputLabel>Take Profit</InputLabel>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.00001"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      placeholder="0.00000"
                      className={[inputClass, "pr-16"].join(" ")}
                      style={numberFontStyle}
                    />

                    <span
                      className={[
                        "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
                        "text-[9px] font-normal uppercase",
                        direction === "LONG"
                          ? "text-green-600"
                          : "text-red-600",
                      ].join(" ")}
                      style={numberFontStyle}
                    >
                      Target
                    </span>
                  </div>
                </div>

                {/* Stop Loss */}
                <div>
                  <InputLabel>Stop Loss</InputLabel>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.00001"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      placeholder="0.00000"
                      className={[inputClass, "pr-16"].join(" ")}
                      style={numberFontStyle}
                    />

                    <span
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-normal uppercase text-red-600"
                      style={numberFontStyle}
                    >
                      Risk
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ------------------------------------------------------------ */}
            {/* Performance                                                    */}
            {/* ------------------------------------------------------------ */}

            <SectionCard
              title="Performance"
              description="Record the financial result and your self-assessment."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* P&L */}
                <div>
                  <InputLabel>P&L</InputLabel>

                  <input
                    type="number"
                    step="0.01"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                    style={{
                      ...numberFontStyle,
                      color:
                        pnl && Number(pnl) >= 0
                          ? PROFIT_COLOR
                          : pnl
                            ? LOSS_COLOR
                            : undefined,
                    }}
                  />
                </div>

                {/* Fees */}
                <div>
                  <InputLabel>Fees</InputLabel>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                    style={numberFontStyle}
                  />
                </div>

                {/* Score */}
                <div>
                  <InputLabel>Score</InputLabel>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="1 - 10"
                      className={[inputClass, "pr-14"].join(" ")}
                      style={numberFontStyle}
                    />

                    <span
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-normal text-zinc-400"
                      style={numberFontStyle}
                    >
                      / 10
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ------------------------------------------------------------ */}
            {/* Journal                                                        */}
            {/* ------------------------------------------------------------ */}

            <SectionCard
              title="Journal"
              description="Document the setup and what you learned from the trade."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Setup */}
                <div>
                  <InputLabel>Setup</InputLabel>

                  <input
                    type="text"
                    value={setup}
                    onChange={(e) => setSetup(e.target.value)}
                    placeholder="e.g. Breakout, pullback, reversal..."
                    className={inputClass}
                    style={numberFontStyle}
                  />
                </div>

                {/* Lesson */}
                <div>
                  <InputLabel>Lesson / Notes</InputLabel>

                  <textarea
                    value={lesson}
                    onChange={(e) => setLesson(e.target.value)}
                    placeholder="What went well? What could you improve?"
                    rows={1}
                    className={textareaClass}
                    style={numberFontStyle}
                  />
                </div>
              </div>
            </SectionCard>

            {/* ------------------------------------------------------------ */}
            {/* Error                                                           */}
            {/* ------------------------------------------------------------ */}

            {error && (
              <div
                className={[
                  "rounded-2xl bg-[#eef1f5] px-4 py-3.5",
                  lossShadow,
                ].join(" ")}
              >
                <p
                  className="text-xs font-normal leading-5 text-red-700"
                  style={numberFontStyle}
                >
                  {error}
                </p>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* Actions                                                         */}
            {/* ------------------------------------------------------------ */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#d7dce4] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className={[
                  "h-11 rounded-xl bg-[#eef1f5] px-6",
                  "text-[10px] font-normal uppercase tracking-[0.14em]",
                  "text-zinc-500",
                  "transition-all duration-300",
                  neutralShadow,
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
                style={numberFontStyle}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={[
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl",
                  "bg-zinc-900 px-7",
                  "text-[10px] font-normal uppercase tracking-[0.14em] text-white",
                  "shadow-lg",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5 hover:bg-zinc-800",
                  "active:translate-y-0",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
                style={numberFontStyle}
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} strokeWidth={1.8} />
                    Save Trade
                  </>
                )}
              </button>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Required hint                                                   */}
            {/* ------------------------------------------------------------ */}

            <div className="pb-5 text-center">
              <p
                className="text-[10px] font-normal text-zinc-400"
                style={numberFontStyle}
              >
                <span className="text-red-400">*</span> Required fields
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}