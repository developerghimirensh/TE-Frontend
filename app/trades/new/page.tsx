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
/* Colors and bright-violet neumorphic styling                                */
/* -------------------------------------------------------------------------- */

const PROFIT_COLOR = "#4ade80";
const LOSS_COLOR = "#fb7185";

const panelClass = [
  "rounded-[24px] border border-violet-400/60 bg-[#121026]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_28px_rgba(139,92,246,0.12),0_0_0_1px_rgba(139,92,246,0.18),0_10px_30px_rgba(0,0,0,0.35)]",
  "transition-all duration-300",
  "hover:border-violet-300/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_32px_rgba(139,92,246,0.16),0_0_22px_rgba(139,92,246,0.15),0_10px_30px_rgba(0,0,0,0.35)]",
].join(" ");

const insetShadow = [
  "shadow-[inset_0_2px_5px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(6,3,22,0.48),inset_0_0_24px_rgba(139,92,246,0.17)]",
].join(" ");

const inputFocusClass =
  "focus:border-violet-200/60 focus:ring-2 focus:ring-violet-400/25 focus:shadow-[inset_0_2px_5px_rgba(255,255,255,0.09),inset_0_-8px_18px_rgba(6,3,22,0.4),inset_0_0_28px_rgba(139,92,246,0.25),0_0_18px_rgba(139,92,246,0.2)]";

const neutralShadow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(167,139,250,0.25),0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),inset_0_-8px_18px_rgba(5,3,18,0.35),0_0_22px_rgba(139,92,246,0.28)]";

const profitShadow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(74,222,128,0.45),0_0_20px_rgba(74,222,128,0.1)]";

const lossShadow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(251,113,133,0.45),0_0_20px_rgba(251,113,133,0.1)]";

/* -------------------------------------------------------------------------- */
/* Date helpers                                                               */
/* -------------------------------------------------------------------------- */

function getLocalDateTime(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function getLocalDateTimeMinus15Minutes(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 15);
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
      className="mb-2 block text-[9px] font-normal uppercase tracking-[0.12em] text-violet-200"
      style={numberFontStyle}
    >
      {children}
      {required && <span className="ml-1 text-rose-300">*</span>}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Input styling                                                              */
/* -------------------------------------------------------------------------- */

const inputClass = [
  "h-11 w-full rounded-xl border border-violet-400/50 bg-[#15122a] px-3.5",
  "text-sm font-normal text-violet-50",
  "outline-none transition-all duration-300",
  "placeholder:text-violet-300/65",
  "shadow-[inset_0_2px_5px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(6,3,22,0.48),inset_0_0_24px_rgba(139,92,246,0.16)]",
  inputFocusClass,
].join(" ");



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
    <section className={`${panelClass} p-5 sm:p-6`}>
      <div className="mb-6">
        <h2
          className="bg-gradient-to-r from-violet-100 via-fuchsia-200 to-indigo-200 bg-clip-text text-[18px] font-normal text-transparent"
          style={displayFontStyle}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-xs font-normal text-violet-200/80" style={numberFontStyle}>
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function NewTradePage() {
  const router = useRouter();

  const [symbol, setSymbol] = useState("XAUUSD");
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [lots, setLots] = useState("0.1");

  const [entryTime, setEntryTime] = useState(getLocalDateTimeMinus15Minutes());
  const [exitTime, setExitTime] = useState(getLocalDateTime());

  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [pnl, setPnl] = useState("100");
  const [fees, setFees] = useState("0");
  const [score, setScore] = useState("");
  const [setup, setSetup] = useState("Smart Money Concept");
  const [lesson, setLesson] = useState("1 Session, 1 Strategy, 1 Trade");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationMessage = useMemo(() => {
    if (!symbol.trim()) return "Symbol is required.";
    if (!lots || Number(lots) <= 0) return "Lots must be greater than 0.";
    if (!entryPrice || Number(entryPrice) <= 0)
      return "Entry price must be greater than 0.";

    if (exitTime && entryTime) {
      const entry = new Date(entryTime).getTime();
      const exit = new Date(exitTime).getTime();
      if (exit < entry) return "Exit time cannot be before entry time.";
    }

    if (takeProfit) {
      const tp = Number(takeProfit);
      const entry = Number(entryPrice);
      if (direction === "LONG" && tp <= entry)
        return "For a LONG trade, take profit must be above entry price.";
      if (direction === "SHORT" && tp >= entry)
        return "For a SHORT trade, take profit must be below entry price.";
    }

    if (stopLoss) {
      const sl = Number(stopLoss);
      const entry = Number(entryPrice);
      if (direction === "LONG" && sl >= entry)
        return "For a LONG trade, stop loss must be below entry price.";
      if (direction === "SHORT" && sl <= entry)
        return "For a SHORT trade, stop loss must be above entry price.";
    }

    if (fees && Number(fees) < 0) return "Fees cannot be negative.";

    if (score) {
      const scoreNumber = Number(score);
      if (!Number.isInteger(scoreNumber) || scoreNumber < 1 || scoreNumber > 10)
        return "Score must be a whole number between 1 and 10.";
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

  function handleCancel() {
    router.push("/trades");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(91,33,182,0.16),transparent_45%),#0b0718] px-4 py-5 text-violet-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-7">
          <Link
            href="/trades"
            className="mb-5 inline-flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.12em] text-violet-200 transition-all duration-300 hover:-translate-x-0.5 hover:text-white"
            style={numberFontStyle}
          >
            <ArrowLeft size={15} strokeWidth={1.8} />
            Back to Trades
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
                <span
                  className="text-[10px] font-normal uppercase tracking-[0.16em] text-violet-200"
                  style={numberFontStyle}
                >
                  The Millionaire Diary
                </span>
              </div>

              <h1
                className="bg-gradient-to-r from-violet-200 via-fuchsia-300 to-indigo-200 bg-clip-text text-[28px] font-normal leading-tight tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(139,92,246,0.22)] sm:text-[34px]"
                style={displayFontStyle}
              >
                New Trade
              </h1>

              <p className="mt-2 max-w-xl text-xs font-normal text-violet-200/80 sm:text-sm" style={numberFontStyle}>
                Record your trade, risk management and the lesson behind the decision.
              </p>
            </div>

            <div
              className={[
                "hidden items-center gap-2 rounded-xl border border-violet-400/70 bg-[#121026] px-4 py-2.5 sm:flex",
                direction === "LONG" ? profitShadow : lossShadow,
              ].join(" ")}
            >
              {direction === "LONG" ? (
                <TrendingUp size={16} style={{ color: PROFIT_COLOR }} strokeWidth={1.8} />
              ) : (
                <TrendingDown size={16} style={{ color: LOSS_COLOR }} strokeWidth={1.8} />
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
            <SectionCard title="Trade Information" description="Basic details about the position.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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

                <div>
                  <InputLabel required>Lots</InputLabel>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={lots}
                    onChange={(e) => setLots(e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} no-number-spinner`}
                    style={numberFontStyle}
                  />
                </div>

                <div>
                  <InputLabel required>Direction</InputLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDirection("LONG")}
                      className={[
                        "flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-400/70 bg-[#15122a]",
                        "text-[11px] font-normal uppercase tracking-[0.12em] transition-all duration-300",
                        direction === "LONG"
                          ? "text-green-300 shadow-[inset_0_0_24px_rgba(74,222,128,0.12),0_0_16px_rgba(74,222,128,0.08)]"
                          : "text-violet-200",
                        "hover:border-violet-200",
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
                        "flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-400/70 bg-[#15122a]",
                        "text-[11px] font-normal uppercase tracking-[0.12em] transition-all duration-300",
                        direction === "SHORT"
                          ? "text-rose-300 shadow-[inset_0_0_24px_rgba(251,113,133,0.12),0_0_16px_rgba(251,113,133,0.08)]"
                          : "text-violet-200",
                        "hover:border-violet-200",
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

            <SectionCard title="Entry & Exit" description="Capture exactly when and where the position was opened and closed.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className={`${insetShadow} rounded-2xl border border-violet-400/70 bg-[#15122a] p-4`}>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.75)]" />
                    <span className="text-[9px] uppercase tracking-[0.12em] text-violet-200" style={numberFontStyle}>Entry</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <InputLabel required>Entry Price</InputLabel>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        placeholder="0.00000"
                        className={`${inputClass} no-number-spinner`}
                        style={numberFontStyle}
                      />
                    </div>
                    <div>
                      <InputLabel required>Entry Time</InputLabel>
                      <input type="datetime-local" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} className={inputClass} style={numberFontStyle} />
                    </div>
                  </div>
                </div>

                <div className={`${insetShadow} rounded-2xl border border-violet-400/70 bg-[#15122a] p-4`}>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_10px_rgba(232,121,249,0.75)]" />
                    <span className="text-[9px] uppercase tracking-[0.12em] text-violet-200" style={numberFontStyle}>Exit</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <InputLabel>Exit Price</InputLabel>
                      <input type="number" min="0" step="any" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} placeholder="0.00000" className={`${inputClass} no-number-spinner`} style={numberFontStyle} />
                    </div>
                    <div>
                      <InputLabel>Exit Time</InputLabel>
                      <input type="datetime-local" value={exitTime} onChange={(e) => setExitTime(e.target.value)} className={inputClass} style={numberFontStyle} />
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Risk Management" description="Define your planned take profit and stop loss.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <InputLabel>Take Profit</InputLabel>
                  <div className="relative">
                    <input type="number" min="0" step="any" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="0.00000" className={`${inputClass} no-number-spinner pr-16`} style={numberFontStyle} />
                    <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] uppercase ${direction === "LONG" ? "text-green-300" : "text-rose-300"}`} style={numberFontStyle}>Target</span>
                  </div>
                </div>
                <div>
                  <InputLabel>Stop Loss</InputLabel>
                  <div className="relative">
                    <input type="number" min="0" step="any" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="0.00000" className={`${inputClass} no-number-spinner pr-16`} style={numberFontStyle} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] uppercase text-rose-300" style={numberFontStyle}>Risk</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Performance" description="Record the financial result and your self-assessment.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <InputLabel>P&amp;L</InputLabel>
                  <input
                    type="number"
                    step="any"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} no-number-spinner`}
                    style={{
                      ...numberFontStyle,
                      color: pnl && Number(pnl) >= 0 ? PROFIT_COLOR : pnl ? LOSS_COLOR : undefined,
                    }}
                  />
                </div>
                <div>
                  <InputLabel>Fees</InputLabel>
                  <input type="number" min="0" step="any" value={fees} onChange={(e) => setFees(e.target.value)} placeholder="0.00" className={`${inputClass} no-number-spinner`} style={numberFontStyle} />
                </div>
                <div>
                  <InputLabel>Score</InputLabel>
                  <div className="relative">
                    <input type="number" min="1" max="10" step="any" value={score} onChange={(e) => setScore(e.target.value)} placeholder="1 - 10" className={`${inputClass} no-number-spinner pr-14`} style={numberFontStyle} />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-violet-200/80" style={numberFontStyle}>/ 10</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Journal" description="Document the setup and what you learned from the trade.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <InputLabel>Setup</InputLabel>
                  <input type="text" value={setup} onChange={(e) => setSetup(e.target.value)} placeholder="e.g. Breakout, pullback, reversal..." className={inputClass} style={numberFontStyle} />
                </div>
                <div>
                  <InputLabel>Lesson / Notes</InputLabel>
                  <input type="text" value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder="What went well? What could you improve?"  className={inputClass} style={numberFontStyle} />
                </div>
              </div>
            </SectionCard>

            {error && (
              <div className={`${lossShadow} rounded-2xl border border-rose-300/80 bg-[#121026] px-4 py-3.5`}>
                <p className="text-xs leading-5 text-rose-200" style={numberFontStyle}>{error}</p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-violet-400/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className={`h-11 rounded-xl border border-violet-400/70 bg-[#121026] px-6 text-[10px] uppercase tracking-[0.14em] text-violet-100 transition-all duration-300 hover:border-violet-200 ${neutralShadow} disabled:cursor-not-allowed disabled:opacity-50`}
                style={numberFontStyle}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-300 bg-gradient-to-r from-violet-700 via-violet-600 to-fuchsia-600 px-7 text-[10px] uppercase tracking-[0.14em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-5px_12px_rgba(30,10,60,0.25),0_0_24px_rgba(139,92,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-100 hover:from-violet-600 hover:via-violet-500 hover:to-fuchsia-500 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
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

            <div className="pb-5 text-center">
              <p className="text-[10px] text-violet-200/80" style={numberFontStyle}>
                <span className="text-rose-300">*</span> Required fields
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Hide native number-input increment/decrement controls across browsers. */}
      <style jsx global>{`
        input.no-number-spinner::-webkit-outer-spin-button,
        input.no-number-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input.no-number-spinner {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
    </main>
  );
}
