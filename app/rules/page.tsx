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

// ============================================================
// DESIGN
// ============================================================

const FONT_DISPLAY =
  '"Lucida Fax", "Lucida Bright", Georgia, serif';

const FONT_NUMBERS =
  '"Rubik", "Gotham", Arial, sans-serif';

const PROFIT_COLOR = "#15803d";

const neutralShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.20),-8px_-8px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.25),-10px_-10px_24px_rgba(255,255,255,1)]";

const profitShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.18),-8px_-8px_18px_rgba(255,255,255,0.95),0_4px_16px_rgba(21,128,61,0.10)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.22),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(21,128,61,0.25)]";

const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.16),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]";

// ============================================================
// RULE DATA
// ============================================================

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
    number: "03",
    title: "1% Risk",
    rule: "Trade Only With Max 1% Risk",
    description:
      "Protect your capital by risking no more than 1% of your account on a single trade.",
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

// ============================================================
// RULE CARD
// ============================================================

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
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border border-zinc-300/70
        bg-[#eef1f5]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-green-600/70
        ${profitShadow}
      `}
    >
      {/* Top number */}

      <div className="flex items-start justify-between gap-4">
        <span
          className="
            text-[11px]
            font-medium
            tracking-[0.20em]
            text-zinc-400
          "
          style={{ fontFamily: FONT_NUMBERS }}
        >
          {number}
        </span>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border border-zinc-300/70
            bg-[#eef1f5]
            transition-all
            duration-300
            group-hover:border-green-600/50
            ${insetShadow}
          `}
        >
          <Icon
            size={19}
            strokeWidth={1.7}
            className="
              text-zinc-600
              transition-colors
              duration-300
              group-hover:text-green-700
            "
          />
        </div>
      </div>

      {/* Category */}

      <p
        className="
          mt-6
          text-[11px]
          font-medium
          uppercase
          tracking-[0.18em]
          text-green-700
        "
        style={{ fontFamily: FONT_NUMBERS }}
      >
        {title}
      </p>

      {/* Rule */}

      <h2
        className="
          mt-2.5
          text-[19px]
          font-medium
          leading-[1.4]
          tracking-[-0.015em]
          text-zinc-900
        "
        style={{ fontFamily: FONT_DISPLAY }}
      >
        {rule}
      </h2>

      {/* Divider */}

      <div className="my-5 h-px bg-zinc-300/60" />

      {/* Description */}

      <p
        className="
          text-[13px]
          font-normal
          leading-[1.7]
          tracking-[0.005em]
          text-zinc-500
        "
      >
        {description}
      </p>

      {/* Bottom check */}

      <div className="mt-6 flex items-center gap-2">
        <CheckCircle2
          size={15}
          strokeWidth={1.8}
          className="text-green-700"
        />

        <span
          className="
            text-[11px]
            font-medium
            tracking-[0.02em]
            text-zinc-500
          "
        >
          Rule to follow
        </span>
      </div>
    </article>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function TradingRulesPage() {
  return (
    <main className="min-h-screen bg-[#eef1f5] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mb-9">

          <Link
            href="/dashboard"
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              text-[13px]
              font-medium
              tracking-[0.01em]
              text-zinc-500
              transition-colors
              duration-200
              hover:text-green-700
            "
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-green-700
                "
                style={{ fontFamily: FONT_NUMBERS }}
              >
                The Millionaire Diary
              </p>

              <h1
                className="
                  mt-2
                  text-[32px]
                  font-medium
                  leading-tight
                  tracking-[-0.025em]
                  text-zinc-900
                  sm:text-[38px]
                "
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Trading Rules
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-[13px]
                  font-normal
                  leading-[1.7]
                  tracking-[0.005em]
                  text-zinc-500
                "
              >
                A simple framework to keep your trading disciplined,
                focused and consistent.
              </p>
            </div>

            {/* Rule count */}

            <div
              className={`
                flex
                items-center
                gap-4
                rounded-3xl
                border border-zinc-300/70
                bg-[#eef1f5]
                px-5
                py-4
                ${neutralShadow}
              `}
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-2xl
                  border border-zinc-300/70
                  bg-[#eef1f5]
                "
              >
                <BookOpen
                  size={18}
                  strokeWidth={1.7}
                  className="text-green-700"
                />
              </div>

              <div>
                <p
                  className="
                    text-[11px]
                    font-medium
                    tracking-[0.03em]
                    text-zinc-500
                  "
                >
                  Active Rules
                </p>

                <p
                  className="
                    mt-0.5
                    text-[21px]
                    font-medium
                    leading-none
                    tracking-[-0.02em]
                    text-zinc-900
                  "
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  08
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ==================================================
            PRINCIPLE BANNER
        ================================================== */}

        <section
          className={`
            mb-7
            rounded-[2rem]
            border border-zinc-300/70
            bg-[#eef1f5]
            p-6
            sm:p-7
            ${profitShadow}
            hover:border-green-600/70
          `}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="max-w-2xl">
              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.20em]
                  text-green-700
                "
                style={{ fontFamily: FONT_NUMBERS }}
              >
                The Trader's Code
              </p>

              <h2
                className="
                  mt-2
                  text-[23px]
                  font-medium
                  leading-tight
                  tracking-[-0.02em]
                  text-zinc-900
                "
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Follow the plan. Protect the capital.
              </h2>

              <p
                className="
                  mt-2
                  text-[13px]
                  font-normal
                  leading-[1.7]
                  tracking-[0.005em]
                  text-zinc-500
                "
              >
                Your edge comes from consistent execution, not from
                taking more trades. Every rule exists to protect your
                decision-making process.
              </p>
            </div>

            <div
              className="
                shrink-0
                rounded-2xl
                border border-zinc-300/70
                bg-[#eef1f5]
                px-5
                py-4
              "
              style={{
                boxShadow:
                  "inset 5px 5px 12px rgba(163,177,198,0.14), inset -5px -5px 12px rgba(255,255,255,0.9)",
              }}
            >
              <p
                className="
                  text-center
                  text-[25px]
                  font-medium
                  leading-none
                  tracking-[-0.025em]
                  text-green-700
                "
                style={{ fontFamily: FONT_NUMBERS }}
              >
                1%
              </p>

              <p
                className="
                  mt-2
                  text-center
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-zinc-500
                "
              >
                Maximum risk
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            RULE GRID
        ================================================== */}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2
                className="
                  text-[20px]
                  font-medium
                  leading-tight
                  tracking-[-0.015em]
                  text-zinc-900
                "
                style={{ fontFamily: FONT_DISPLAY }}
              >
                My Rules
              </h2>

              <p
                className="
                  mt-1.5
                  text-[12px]
                  font-normal
                  leading-5
                  tracking-[0.005em]
                  text-zinc-500
                "
              >
                Keep these rules visible before every trading session.
              </p>
            </div>

            <span
              className="
                hidden
                rounded-full
                border border-zinc-300/70
                px-3
                py-1.5
                text-[10px]
                font-medium
                tracking-[0.08em]
                text-zinc-500
                sm:block
              "
            >
              Discipline &gt; Emotion
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rules.map((item) => (
              <RuleCard
                key={item.number}
                {...item}
              />
            ))}
          </div>
        </section>

        {/* ==================================================
            DAILY CHECKLIST
        ================================================== */}

        <section className="mt-7">
          <div
            className={`
              rounded-[2rem]
              border border-zinc-300/70
              bg-[#eef1f5]
              p-6
              sm:p-7
              ${neutralShadow}
            `}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p
                  className="
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.20em]
                    text-zinc-500
                  "
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  Before You Trade
                </p>

                <h2
                  className="
                    mt-2
                    text-[23px]
                    font-medium
                    leading-tight
                    tracking-[-0.02em]
                    text-zinc-900
                  "
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  Is the setup worth taking?
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                {[
                  "New York Session",
                  "SMC Setup",
                  "≤ 1% Risk",
                  "Right Mental State",
                ].map((item) => (
                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      border border-zinc-300/70
                      bg-[#eef1f5]
                      px-4
                      py-3
                      text-[12px]
                      font-medium
                      tracking-[0.005em]
                      text-zinc-700
                    "
                  >
                    <CheckCircle2
                      size={16}
                      strokeWidth={1.8}
                      className="shrink-0 text-green-700"
                    />

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FINAL REMINDER
        ================================================== */}

        <section className="py-8 text-center">
          <p
            className="
              text-[13px]
              font-medium
              tracking-[0.02em]
              text-zinc-500
            "
          >
            No setup. No trade.
          </p>

          <p
            className="
              mt-2
              text-[11px]
              font-normal
              tracking-[0.01em]
              text-zinc-400
            "
          >
            Protect your capital today so you can trade tomorrow.
          </p>
        </section>

      </div>
    </main>
  );
}
