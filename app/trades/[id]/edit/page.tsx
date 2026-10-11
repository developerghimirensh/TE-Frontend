"use client";



import { FormEvent, useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import {

  ArrowLeft,

  Loader2,

  Save,

  TrendingDown,

  TrendingUp,

} from "lucide-react";



import { getTrade, updateTrade, type Trade, type TradeInput } from "@/lib/api";



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



const PROFIT_COLOR = "#4ade80";

const LOSS_COLOR = "#fb7185";



/* -------------------------------------------------------------------------- */

/* Neumorphism Shadows                                                        */

/* -------------------------------------------------------------------------- */



const neutralShadow = "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(167,139,250,0.25),0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),inset_0_-8px_18px_rgba(5,3,18,0.35),0_0_22px_rgba(139,92,246,0.28)]";



const insetShadow = "shadow-[inset_0_2px_5px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(6,3,22,0.48),inset_0_0_24px_rgba(139,92,246,0.17)]";



const insetShadowFocus = "focus:border-violet-200 focus:ring-2 focus:ring-violet-400/25 focus:shadow-[inset_0_2px_5px_rgba(255,255,255,0.09),inset_0_-8px_18px_rgba(6,3,22,0.4),inset_0_0_28px_rgba(139,92,246,0.25),0_0_18px_rgba(139,92,246,0.2)]";



const profitShadow = "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(74,222,128,0.45),0_0_20px_rgba(74,222,128,0.1)]";



const lossShadow = "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(251,113,133,0.45),0_0_20px_rgba(251,113,133,0.1)]";



/* -------------------------------------------------------------------------- */

/* Helpers                                                                    */

/* -------------------------------------------------------------------------- */



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

      {required && <span className="ml-1 text-rose-400">*</span>}

    </label>

  );

}



/* -------------------------------------------------------------------------- */

/* Input classes                                                              */

/* -------------------------------------------------------------------------- */



const inputClass = [

  "h-11 w-full rounded-xl border border-violet-400/70 bg-[#15122a] px-3.5",

  "text-sm font-normal text-violet-50",

  "outline-none",

  "transition-all duration-300",

  "placeholder:text-violet-200",

  insetShadow,

  insetShadowFocus,

].join(" ");



const textareaClass = [

  "w-full rounded-xl border border-violet-400/70 bg-[#15122a] px-3.5 py-3",

  "text-sm font-normal leading-6 text-violet-50",

  "outline-none resize-none",

  "placeholder:text-violet-200",

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

        "rounded-[24px] border border-violet-400/70 bg-[#121026] p-5 sm:p-6",

        "transition-all duration-300",

        neutralShadow,

      ].join(" ")}

    >

      <div className="mb-6">

        <h2

          className="text-[18px] font-normal text-violet-50"

          style={displayFontStyle}

        >

          {title}

        </h2>



        {description && (

          <p

            className="mt-1.5 text-xs font-normal text-violet-200"

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



export default function EditTradePage() {

  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);



  /* ------------------------------------------------------------------------ */

  /* Default Values                                                           */

  /* ------------------------------------------------------------------------ */



  const [symbol, setSymbol] = useState("");

  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");

  const [lots, setLots] = useState("");



  const [entryTime, setEntryTime] = useState("");

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



  function toLocalDateTime(value: string | null | undefined): string {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return local.toISOString().slice(0, 16);
  }

  useEffect(() => {
    if (!id) {
      setError("Trade ID is missing.");
      setLoading(false);
      return;
    }
    let mounted = true;

    async function loadTrade() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTrade(Number(id));
        if (!mounted) return;
        setTrade(data);
        setSymbol(data.symbol ?? "");
        setDirection(data.direction === "SHORT" ? "SHORT" : "LONG");
        setLots(data.lots != null ? String(data.lots) : "");
        setEntryTime(toLocalDateTime(data.entry_time));
        setExitTime(toLocalDateTime(data.exit_time));
        setEntryPrice(data.entry_price != null ? String(data.entry_price) : "");
        setExitPrice(data.exit_price != null ? String(data.exit_price) : "");
        setTakeProfit(data.take_profit != null ? String(data.take_profit) : "");
        setStopLoss(data.stop_loss != null ? String(data.stop_loss) : "");
        setPnl(data.pnl != null ? String(data.pnl) : "");
        setFees(data.fees != null ? String(data.fees) : "0");
        setScore(data.score != null ? String(data.score) : "");
        setSetup(data.setup ?? "");
        setLesson(data.lesson ?? "");
      } catch (err) {
        console.error(err);
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load this trade.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTrade();
    return () => { mounted = false; };
  }, [id]);

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



    if (!trade) {
      setError("Trade information is unavailable.");
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



      await updateTrade(trade.id, data);



      router.push(`/trades/${trade.id}`);

    } catch (err) {

      console.error(err);



      setError(

        err instanceof Error

          ? err.message

          : "Unable to update trade. Please try again.",

      );

    } finally {

      setSaving(false);

    }

  }



  /* ------------------------------------------------------------------------ */

  /* Reset                                                                    */

  /* ------------------------------------------------------------------------ */



  function handleCancel() {
    router.push(trade ? `/trades/${trade.id}` : "/trades");
  }



  /* ------------------------------------------------------------------------ */

  /* Render                                                                   */

  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0718] px-4">
        <div className={`flex items-center gap-3 rounded-2xl border border-violet-400/70 bg-[#121026] px-5 py-4 ${neutralShadow}`}>
          <Loader2 size={17} className="animate-spin text-violet-300" />
          <span className="text-[11px] uppercase tracking-[0.12em] text-violet-200/70" style={numberFontStyle}>Loading trade</span>
        </div>
      </main>
    );
  }

  if (error && !trade) {
    return (
      <main className="min-h-screen bg-[#0b0718] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <Link href="/trades" className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-violet-300/70 hover:text-violet-50" style={numberFontStyle}><ArrowLeft size={15} />Back to Trades</Link>
          <div className={`rounded-[24px] border border-rose-400/20 bg-[#121026] p-8 text-center ${lossShadow}`}>
            <h1 className="text-xl text-violet-50" style={displayFontStyle}>Unable to Load Trade</h1>
            <p className="mx-auto mt-2 max-w-md whitespace-pre-line text-xs leading-5 text-violet-200" style={numberFontStyle}>{error}</p>
            <Link href="/trades" className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-violet-500/15 px-5 text-[10px] uppercase tracking-[0.13em] text-violet-50 hover:bg-violet-500/25" style={numberFontStyle}>View Trades</Link>
          </div>
        </div>
      </main>
    );
  }

  return (

    <main
      className="min-h-screen bg-[#0b0718] px-4 py-5 sm:px-6 lg:px-8"
      style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.12), transparent 48%)" }}
    >

      <div className="mx-auto max-w-[1180px]">

        {/* ---------------------------------------------------------------- */}

        {/* Header                                                            */}

        {/* ---------------------------------------------------------------- */}



        <header className="mb-7">

          <Link

            href={trade ? `/trades/${trade.id}` : "/trades"}

            className="mb-5 inline-flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.12em] text-violet-300/70 transition-all duration-300 hover:-translate-x-0.5 hover:text-violet-50"

            style={numberFontStyle}

          >

            <ArrowLeft size={15} strokeWidth={1.8} />

            Back to Trade

          </Link>



          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />



                <span

                  className="text-[10px] font-normal uppercase tracking-[0.16em] text-violet-200"

                  style={numberFontStyle}

                >

                  The Millionaire Diary

                </span>

              </div>



              <h1

                className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-[28px] font-normal leading-tight tracking-tight text-transparent sm:text-[34px]"

                style={displayFontStyle}

              >

                Edit Trade

              </h1>



              <p

                className="mt-2 max-w-xl text-xs font-normal text-violet-300/70 sm:text-sm"

                style={numberFontStyle}

              >

                Update your trade, risk management, performance and journal details.

              </p>

            </div>



            {/* Direction indicator */}

            <div

              className={[

                "hidden items-center gap-2 rounded-xl bg-[#121026] px-4 py-2.5 sm:flex",

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

                  color:

                    direction === "LONG" ? PROFIT_COLOR : LOSS_COLOR,

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

                    className={`${inputClass} no-number-spinner`}

                    style={numberFontStyle}

                  />

                </div>



                {/* Lots */}

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



                {/* Direction */}

                <div>

                  <InputLabel required>Direction</InputLabel>



                  <div className="grid grid-cols-2 gap-2">

                    <button

                      type="button"

                      onClick={() => setDirection("LONG")}

                      className={[

                        "flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-400/70 bg-[#15122a]",

                        "text-[11px] font-normal uppercase tracking-[0.12em]",

                        "transition-all duration-300",

                        direction === "LONG"

                          ? [insetShadow, "text-green-300"].join(" ")

                          : [neutralShadow, "text-violet-200"].join(" "),

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

                        "text-[11px] font-normal uppercase tracking-[0.12em]",

                        "transition-all duration-300",

                        direction === "SHORT"

                          ? [insetShadow, "text-rose-300"].join(" ")

                          : [neutralShadow, "text-violet-200"].join(" "),

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

                  className={[

                    "rounded-2xl border border-violet-400/70 bg-[#15122a] p-4",

                    insetShadow,

                  ].join(" ")}

                >

                  <div className="mb-4 flex items-center gap-2">

                    <div className="h-2 w-2 rounded-full bg-violet-400" />



                    <span

                      className="text-[9px] font-normal uppercase tracking-[0.12em] text-violet-300"

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



                      <input

                        type="datetime-local"

                        value={entryTime}

                        onChange={(e) => setEntryTime(e.target.value)}

                        className={`${inputClass} no-number-spinner`}

                        style={numberFontStyle}

                      />

                    </div>

                  </div>

                </div>



                {/* Exit */}

                <div

                  className={[

                    "rounded-2xl border border-violet-400/70 bg-[#15122a] p-4",

                    insetShadow,

                  ].join(" ")}

                >

                  <div className="mb-4 flex items-center gap-2">

                    <div className="h-2 w-2 rounded-full bg-violet-300/60" />



                    <span

                      className="text-[9px] font-normal uppercase tracking-[0.12em] text-violet-300"

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

                        step="any"

                        value={exitPrice}

                        onChange={(e) => setExitPrice(e.target.value)}

                        placeholder="0.00000"

                        className={`${inputClass} no-number-spinner`}

                        style={numberFontStyle}

                      />

                    </div>



                    <div>

                      <InputLabel>Exit Time</InputLabel>



                      <input

                        type="datetime-local"

                        value={exitTime}

                        onChange={(e) => setExitTime(e.target.value)}

                        className={`${inputClass} no-number-spinner`}

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

                      step="any"

                      value={takeProfit}

                      onChange={(e) => setTakeProfit(e.target.value)}

                      placeholder="0.00000"

                      className={`${inputClass} no-number-spinner pr-16`}

                      style={numberFontStyle}

                    />



                    <span

                      className={[

                        "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",

                        "text-[9px] font-normal uppercase",

                        direction === "LONG"

                          ? "text-green-300"

                          : "text-rose-300",

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

                      step="any"

                      value={stopLoss}

                      onChange={(e) => setStopLoss(e.target.value)}

                      placeholder="0.00000"

                      className={`${inputClass} no-number-spinner pr-16`}

                      style={numberFontStyle}

                    />



                    <span

                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-normal uppercase text-rose-300"

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

                    step="any"

                    value={pnl}

                    onChange={(e) => setPnl(e.target.value)}

                    placeholder="0.00"

                    className={`${inputClass} no-number-spinner`}

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

                    step="any"

                    value={fees}

                    onChange={(e) => setFees(e.target.value)}

                    placeholder="0.00"

                    className={`${inputClass} no-number-spinner`}

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

                      className={`${inputClass} no-number-spinner pr-14`}

                      style={numberFontStyle}

                    />



                    <span

                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-normal text-violet-200"

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

                    className={`${inputClass} no-number-spinner`}

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

                  "rounded-2xl bg-[#121026] px-4 py-3.5",

                  lossShadow,

                ].join(" ")}

              >

                <p

                  className="text-xs font-normal leading-5 text-rose-300"

                  style={numberFontStyle}

                >

                  {error}

                </p>

              </div>

            )}



            {/* ------------------------------------------------------------ */}

            {/* Actions                                                         */}

            {/* ------------------------------------------------------------ */}



            <div className="flex flex-col-reverse gap-3 border-t border-violet-400/50 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <button

                type="button"

                onClick={handleCancel}

                disabled={saving}

                className={[

                  "h-11 rounded-xl bg-[#121026] px-6",

                  "text-[10px] font-normal uppercase tracking-[0.14em]",

                  "text-violet-300",

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

                  "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 px-7",

                  "text-[10px] font-normal uppercase tracking-[0.14em] text-white",

                  "shadow-[0_0_24px_rgba(139,92,246,0.28),0_8px_22px_rgba(0,0,0,0.3)]",

                  "transition-all duration-300",

                  "hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_30px_rgba(139,92,246,0.4),0_8px_22px_rgba(0,0,0,0.3)]",

                  "active:translate-y-0",

                  "disabled:cursor-not-allowed disabled:opacity-60",

                ].join(" ")}

                style={numberFontStyle}

              >

                {saving ? (

                  <>

                    <Loader2 size={15} className="animate-spin" />

                    Updating...

                  </>

                ) : (

                  <>

                    <Save size={15} strokeWidth={1.8} />

                    Update Trade

                  </>

                )}

              </button>

            </div>



            {/* ------------------------------------------------------------ */}

            {/* Required hint                                                   */}

            {/* ------------------------------------------------------------ */}



            <div className="pb-5 text-center">

              <p

                className="text-[10px] font-normal text-violet-200"

                style={numberFontStyle}

              >

                <span className="text-rose-400">*</span> Required fields

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