"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  CircleDollarSign,
  Crosshair,
  Gauge,
  Layers3,
  Target,
  Timer,
} from "lucide-react";

const FONT_DISPLAY = '"Lucida Fax", "Lucida Bright", Georgia, serif';
const FONT_NUMBERS = '"Rubik", "Gotham", Arial, sans-serif';

const neutralShadow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(167,139,250,0.22),0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),inset_0_-8px_18px_rgba(5,3,18,0.35),0_0_22px_rgba(139,92,246,0.24)]";

const profitShadow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.07),inset_0_-8px_18px_rgba(5,3,18,0.42),0_0_0_1px_rgba(167,139,250,0.22),0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_0_22px_rgba(139,92,246,0.24)]";

const insetShadow =
  "shadow-[inset_0_2px_5px_rgba(255,255,255,0.09),inset_0_-8px_18px_rgba(6,3,22,0.48),inset_0_0_22px_rgba(139,92,246,0.16)]";

// The requested visual order is 1, 2, 5, 6 on the first row,
// followed by 3, 4, 7, 8 on the second row.
const rules = [
  {
    number: "01",
    title: "1 Session",
    rule: "Trade Only New York Session",
    description:
      "Focus exclusively on the New York session. Avoid unnecessary trades outside your defined trading window.",
    icon: Timer,
  },
  {
    number: "02",
    title: "1 Strategy",
    rule: "Trade Only SMC Strategy",
    description:
      "Stay committed to your SMC setup. Do not switch strategies because of a losing trade or market noise.",
    icon: Layers3,
  },
  {
    number: "05",
    title: "1 Instrument",
    rule: "Trade Only XAUUSD",
    description:
      "Keep your attention on one instrument. Master its behavior instead of constantly jumping between markets.",
    icon: Crosshair,
  },
  {
    number: "06",
    title: "1 Trade",
    rule: "Only One Trade Per Day",
    description:
      "Once your daily trade is taken, stop. Avoid revenge trading and unnecessary re-entries.",
    icon: Target,
  },
  {
    number: "03",
    title: "5% Risk",
    rule: "Trade Only With Max 5% Risk",
    description:
      "Set a clear risk limit before entering a trade. Never risk more than 5% of your account on a single trade.",
    icon: CircleDollarSign,
  },
  {
    number: "04",
    title: "1 Journal",
    rule: "Journal Every Trade At EOD",
    description:
      "Record every trade at the end of the day. Review execution, emotions, mistakes and lessons.",
    icon: BookOpen,
  },
  {
    number: "07",
    title: "No Trade",
    rule: "Sometimes No Trade Is Best Trade",
    description:
      "If your setup is not present, stay out. Protecting capital is also a successful trading decision.",
    icon: Gauge,
  },
  {
    number: "08",
    title: "Mental Zone",
    rule: "Enjoy The Process",
    description:
      "Focus on executing your plan rather than chasing results. Discipline and consistency come first.",
    icon: Brain,
  },
];

function RuleCard({
  number,
  title,
  rule,
  description,
  icon: Icon,
}: {
  number: string;
  title: string;
  rule: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-violet-400/20 bg-[#121026] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/50 sm:p-6 ${profitShadow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="text-[11px] font-medium tracking-[0.20em] text-violet-300/50"
          style={{ fontFamily: FONT_NUMBERS }}
        >
          {number}
        </span>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-[#17132e] transition-all duration-300 group-hover:border-violet-300/50 ${insetShadow}`}
        >
          <Icon
            size={19}
            strokeWidth={1.7}
            className="text-violet-300 transition-colors duration-300 group-hover:text-fuchsia-200"
          />
        </div>
      </div>

      <p
        className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-300"
        style={{ fontFamily: FONT_NUMBERS }}
      >
        {title}
      </p>

      <h2
        className="mt-2.5 text-[19px] font-medium leading-[1.4] tracking-[-0.015em] text-zinc-100"
        style={{ fontFamily: FONT_DISPLAY }}
      >
        {rule}
      </h2>

      <div className="my-5 h-px bg-gradient-to-r from-violet-400/35 via-fuchsia-400/20 to-transparent" />

      <p className="flex-1 text-[13px] font-normal leading-[1.7] tracking-[0.005em] text-zinc-400">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-2">
        <CheckCircle2 size={15} strokeWidth={1.8} className="text-violet-300" />
        <span className="text-[11px] font-medium tracking-[0.02em] text-zinc-500">
          Rule to follow
        </span>
      </div>
    </article>
  );
}

export default function TradingRulesPage() {
  return (
    <main className="min-h-screen bg-[#0b0718] px-4 py-7 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9">
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.01em] text-zinc-400 transition-colors duration-200 hover:text-violet-200"
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                The Millionaire Diary
              </p>
              <h1
                className="mt-2 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-[32px] font-medium leading-tight tracking-[-0.025em] text-transparent sm:text-[38px]"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Trading Rules
              </h1>
              <p className="mt-3 max-w-2xl text-[13px] font-normal leading-[1.7] tracking-[0.005em] text-zinc-400">
                A simple framework to keep your trading disciplined, focused and
                consistent.
              </p>
            </div>

            <div
              className={`flex items-center gap-4 rounded-3xl border border-violet-400/20 bg-[#121026] px-5 py-4 ${neutralShadow}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-[#17132e] ${insetShadow}`}
              >
                <BookOpen
                  size={18}
                  strokeWidth={1.7}
                  className="text-violet-300"
                />
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.03em] text-zinc-400">
                  Active Rules
                </p>
                <p
                  className="mt-0.5 text-[21px] font-medium leading-none tracking-[-0.02em] text-zinc-100"
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  08
                </p>
              </div>
            </div>
          </div>
        </header>

        <section
          className={`mb-7 rounded-[2rem] border border-violet-400/20 bg-[#121026] p-6 sm:p-7 ${profitShadow}`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p
                className="text-[11px] font-medium uppercase tracking-[0.20em] text-violet-300"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                The Trader&apos;s Code
              </p>
              <h2
                className="mt-2 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-indigo-200 bg-clip-text text-[23px] font-medium leading-tight tracking-[-0.02em] text-transparent"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Follow the plan. Protect the capital.
              </h2>
              <p className="mt-2 text-[13px] font-normal leading-[1.7] tracking-[0.005em] text-zinc-400">
                Your edge comes from consistent execution, not from taking more
                trades. Every rule exists to protect your decision-making
                process.
              </p>
            </div>

            <div
              className={`shrink-0 rounded-2xl border border-violet-300/20 bg-[#17132e] px-5 py-4 ${insetShadow}`}
            >
              <p
                className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-center text-[25px] font-medium leading-none tracking-[-0.025em] text-transparent"
                style={{ fontFamily: FONT_NUMBERS }}
              >
                5%
              </p>
              <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                Maximum risk
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2
                className="text-[20px] font-medium leading-tight tracking-[-0.015em] text-zinc-100"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                My Rules
              </h2>
              <p className="mt-1.5 text-[12px] font-normal leading-5 tracking-[0.005em] text-zinc-400">
                Keep these rules visible before every trading session.
              </p>
            </div>
            <span className="hidden rounded-full border border-violet-300/20 bg-[#121026] px-3 py-1.5 text-[10px] font-medium tracking-[0.08em] text-zinc-400 sm:block">
              Discipline &gt; Emotion
            </span>
          </div>

          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rules.map((item) => (
              <RuleCard key={item.number} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div
            className={`rounded-[1rem] border border-violet-400/20 bg-[#121026] p-6 sm:p-7 ${neutralShadow}`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.20em] text-zinc-400"
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  Before You Trade
                </p>
                <h2
                  className="mt-2 text-[23px] font-medium leading-tight tracking-[-0.02em] text-zinc-100"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  Is the setup worth taking?
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  "New York Session",
                  "SMC Setup",
                  "≤ 5% Risk",
                  "Right Mental State",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-violet-300/15 bg-[#17132e] px-4 py-3 text-[12px] font-medium tracking-[0.005em] text-zinc-300"
                  >
                    <CheckCircle2
                      size={16}
                      strokeWidth={1.8}
                      className="shrink-0 text-violet-300"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 text-center">
          <p className="text-[13px] font-medium tracking-[0.02em] text-zinc-400">
            No setup. No trade.
          </p>
          <p className="mt-2 text-[11px] font-normal tracking-[0.01em] text-zinc-500">
            Protect your capital today so you can trade tomorrow.
          </p>
        </section>
      </div>
    </main>
  );
}
