"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CircleDot,
  Clock3,
  Layers3,
  ShieldCheck,
  Target,
} from "lucide-react";

const FONT_DISPLAY = '"Lucida Fax", "Lucida Bright", Georgia, serif';
const FONT_NUMBERS = '"Rubik", "Gotham", Arial, sans-serif';
const card =
  "border border-violet-400/15 bg-[#121026] shadow-[0_12px_35px_rgba(0,0,0,0.22)]";
const softCard = "border border-violet-400/15 bg-[#15122a]";

type Concept = {
  name: string;
  category: string;
  definition: string;
  why: string;
};

const foundational: Concept[] = [
  {
    name: "Market Structure",
    category: "Structure",
    definition:
      "Price forms a sequence of swing highs and lows. Uptrend = HH/HL; downtrend = LL/LH.",
    why: "Every other concept is relative to the swing sequence. Mark structure first.",
  },
  {
    name: "Break of Structure",
    category: "Structure",
    definition:
      "Price closes beyond the most recent swing point in the direction of the existing trend, confirming continuation.",
    why: "BOS is continuation evidence, not reversal. Do not confuse it with CHoCH.",
  },
  {
    name: "Change of Character",
    category: "Structure",
    definition:
      "The first meaningful break against the prevailing trend, suggesting a possible shift in control.",
    why: "It is the earliest warning that the current trend context may be ending.",
  },
  {
    name: "Order Block",
    category: "Execution",
    definition:
      "The last opposing candle before strong displacement, treated as a presumed institutional order area.",
    why: "It becomes an execution address after a liquidity sweep and structure shift.",
  },
  {
    name: "Fair Value Gap",
    category: "Imbalance",
    definition:
      "A three-candle imbalance where the wicks of candle one and candle three do not overlap.",
    why: "Price often returns to rebalance the imbalance. It can become a secondary entry zone with an OB.",
  },
  {
    name: "Liquidity Pools",
    category: "Liquidity",
    definition:
      "Resting stop clusters typically found above equal highs and below equal lows.",
    why: "A price target can often be reframed as a liquidity draw.",
  },
  {
    name: "Premium / Discount",
    category: "Zones",
    definition:
      "A swing range divided at 50%; above it is premium and below it is discount.",
    why: "An OB positioned in the wrong half of the range is generally lower quality.",
  },
];
const intermediate: Concept[] = [
  {
    name: "Inducement (IDM)",
    category: "Liquidity",
    definition:
      "A smaller engineered liquidity pool that is swept before the real directional move.",
    why: "An OB without a prior IDM sweep can represent a trap leg.",
  },
  {
    name: "Internal vs External Liquidity",
    category: "Liquidity",
    definition:
      "External liquidity sits around major daily/H4 swings; internal liquidity sits inside the range through FVGs, minor swings and IDM.",
    why: "Use HTF external liquidity for bias and LTF internal liquidity for entry.",
  },
  {
    name: "Mitigation Block",
    category: "Execution",
    definition: "The last down-close candle before a weak departure or CHoCH.",
    why: "Useful as a fallback inside a range, but generally less reliable than a true OB.",
  },
  {
    name: "Breaker Block",
    category: "Confluence",
    definition:
      "A failed order block that flips from support to resistance or resistance to support.",
    why: "A breaker following a liquidity sweep can be higher probability than a fresh OB.",
  },
  {
    name: "Judas Swing",
    category: "Timing",
    definition:
      "A false breakout of the Asian range around or before London open, occurring ahead of the true NY direction.",
    why: "On Gold, this can be highly reliable. Track it separately in the journal.",
  },
  {
    name: "AMD Cycle",
    category: "Timing",
    definition:
      "Accumulation during Asia → Manipulation through Judas at London/NY open → Distribution during the real directional move.",
    why: "It anchors sweep confirmation to the Asian range and session structure.",
  },
  {
    name: "Power of Three",
    category: "Timing",
    definition:
      "The AMD cycle repeats fractally, with daily cycles nested inside weekly and monthly cycles.",
    why: "A daily OB late in distribution is lower quality than one formed during the manipulation-to-distribution transition.",
  },
];
const advanced: Concept[] = [
  {
    name: "Optimal Trade Entry",
    category: "Confluence",
    definition:
      "A 62–79% Fibonacci retracement zone used alongside an order block.",
    why: "An OB inside OTE is generally stronger than one formed after a shallow retracement.",
  },
  {
    name: "Propulsion Block",
    category: "Execution",
    definition:
      "The last consolidation candle immediately before strong displacement and an FVG.",
    why: "It helps identify the exact origin candle when several OB candidates exist.",
  },
  {
    name: "Rejection Block",
    category: "Execution",
    definition:
      "A long-wick rejection area rather than a full-bodied order block.",
    why: "Weak on its own. Treat it as confluence only with a sweep and supporting OB.",
  },
  {
    name: "Turtle Soup",
    category: "Liquidity",
    definition:
      "A false breakout of a prior higher-timeframe swing high or low, distinct from a session-timed Judas.",
    why: "A multi-day level sweep carries more weight than a same-session IDM sweep.",
  },
  {
    name: "Unicorn Model",
    category: "Confluence",
    definition:
      "A breaker block overlapping a fair value gap at essentially the same price.",
    why: "Two separate PD arrays converge at one location.",
  },
  {
    name: "Quasimodo (QM) Pattern",
    category: "Filter",
    definition:
      "Strong move → deeper pullback → failed HH/LL → reversal, forming a BOS-failure pattern.",
    why: "Useful as a filter against entering an exhausted move.",
  },
  {
    name: "Venom Model",
    category: "Liquidity",
    definition:
      "Two consecutive same-direction sweeps before the real move: extended IDM → sweep → small retrace → second sweep → BOS.",
    why: "The second sweep can become the primary trigger.",
  },
  {
    name: "Displacement Quality",
    category: "Filter",
    definition:
      "Strong displacement has large bodies, minimal wicks and stacked FVGs; small overlapping candles indicate weak displacement.",
    why: "An objective body-to-range condition helps remove discretionary drift.",
  },
  {
    name: "PD Array Continuation vs Reversal Context",
    category: "Filter",
    definition:
      "The same OB, FVG or breaker becomes stronger when aligned with the higher-timeframe liquidity draw.",
    why: "Higher-timeframe bias should override a lower-timeframe signal when they disagree.",
  },
  {
    name: "Silver Bullet Window",
    category: "Timing",
    definition:
      "A commonly referenced 10–11 AM ET execution window inside the New York kill zone.",
    why: "Backtest it against your own trade log rather than adopting it purely on claim.",
  },
];

const sections = [
  {
    id: "foundational",
    number: "01",
    title: "Foundational",
    subtitle:
      "The structural vocabulary everything else is built on. If any of these are shaky, advanced concepts will not hold up under live conditions.",
    items: foundational,
    tone: "violet",
  },
  {
    id: "intermediate",
    number: "02",
    title: "Intermediate",
    subtitle:
      "Where structure and liquidity concepts combine into a repeatable sequence, and where session timing starts to matter.",
    items: intermediate,
    tone: "fuchsia",
  },
  {
    id: "advanced",
    number: "03",
    title: "Advanced",
    subtitle:
      "Entry precision, model selectivity, and objective filters — the layer that separates a discretionary sketch from a repeatable, testable model.",
    items: advanced,
    tone: "indigo",
  },
];
const sidebarGroups = [
  {
    title: "Foundational",
    links: [
      ["market-structure", "Market Structure"],
      ["break-of-structure", "Break of Structure"],
      ["change-of-character", "Change of Character"],
      ["order-block", "Order Block"],
      ["fair-value-gap", "Fair Value Gap"],
      ["liquidity-pools", "Liquidity Pools"],
      ["premium-discount", "Premium / Discount"],
    ],
  },
  {
    title: "Intermediate",
    links: [
      ["inducement-idm", "Inducement (IDM)"],
      ["internal-external-liquidity", "Internal vs External Liquidity"],
      ["mitigation-block", "Mitigation Block"],
      ["breaker-block", "Breaker Block"],
      ["judas-swing", "Judas Swing"],
      ["amd-cycle", "AMD Cycle"],
      ["power-of-three", "Power of Three"],
    ],
  },
  {
    title: "Advanced",
    links: [
      ["optimal-trade-entry", "Optimal Trade Entry"],
      ["propulsion-block", "Propulsion Block"],
      ["rejection-block", "Rejection Block"],
      ["turtle-soup", "Turtle Soup"],
      ["unicorn-model", "Unicorn Model"],
      ["quasimodo-pattern", "Quasimodo Pattern"],
      ["venom-model", "Venom Model"],
      ["displacement-quality", "Displacement Quality"],
      ["pd-array-context", "PD Array Context"],
      ["silver-bullet", "Silver Bullet Window"],
    ],
  },
];
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
function toneClasses(tone: string) {
  if (tone === "violet")
    return {
      number: "text-violet-300",
      line: "bg-violet-400/60",
      border: "hover:border-violet-400/50",
      chip: "border-violet-400/20 bg-violet-400/10 text-violet-200",
      glow: "hover:shadow-[0_12px_35px_rgba(139,92,246,0.12)]",
    };
  if (tone === "fuchsia")
    return {
      number: "text-fuchsia-300",
      line: "bg-fuchsia-400/60",
      border: "hover:border-fuchsia-400/50",
      chip: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
      glow: "hover:shadow-[0_12px_35px_rgba(217,70,239,0.12)]",
    };
  return {
    number: "text-indigo-300",
    line: "bg-indigo-400/60",
    border: "hover:border-indigo-400/50",
    chip: "border-indigo-400/20 bg-indigo-400/10 text-indigo-200",
    glow: "hover:shadow-[0_12px_35px_rgba(99,102,241,0.12)]",
  };
}
function ConceptCard({
  concept,
  tone,
  index,
}: {
  concept: Concept;
  tone: string;
  index: number;
}) {
  const styles = toneClasses(tone);
  return (
    <article
      id={slugify(concept.name)}
      className={`scroll-mt-8 group rounded-2xl ${softCard} p-5 transition-all duration-300 hover:-translate-y-0.5 ${styles.border} ${styles.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-medium tracking-[0.12em] ${styles.number}`}
              style={{ fontFamily: FONT_NUMBERS }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] ${styles.chip}`}
            >
              {concept.category}
            </span>
          </div>
          <h3
            className="text-[15px] font-medium tracking-[-0.01em] text-zinc-100"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {concept.name}
          </h3>
        </div>
        <CircleDot
          size={14}
          strokeWidth={1.7}
          className="mt-1 shrink-0 text-violet-300/40 transition-colors group-hover:text-violet-300"
        />
      </div>
      <div className="mt-5">
        <p className="text-[12px] font-normal leading-[1.7] tracking-[0.005em] text-zinc-300">
          {concept.definition}
        </p>
        <div className="mt-4 border-t border-violet-400/15 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-300/80">
            Why it matters
          </p>
          <p className="mt-1.5 text-[11px] font-normal leading-[1.65] text-zinc-400">
            {concept.why}
          </p>
        </div>
      </div>
    </article>
  );
}
function Section({
  id,
  number,
  title,
  subtitle,
  items,
  tone,
}: {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  items: Concept[];
  tone: string;
}) {
  const styles = toneClasses(tone);
  return (
    <section id={id} className="scroll-mt-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex shrink-0 flex-col items-center">
          <span
            className={`text-2xl font-medium tracking-[-0.04em] ${styles.number}`}
            style={{ fontFamily: FONT_NUMBERS }}
          >
            {number}
          </span>
          <span className={`mt-2 h-8 w-px ${styles.line}`} />
        </div>
        <div className="pt-1">
          <h2
            className="text-2xl font-medium tracking-[-0.025em] text-zinc-100"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] font-normal leading-[1.7] tracking-[0.005em] text-zinc-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((concept, index) => (
          <ConceptCard
            key={concept.name}
            concept={concept}
            tone={tone}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
function HeroDiagram() {
  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-violet-400/15 bg-[#0e0b1c] p-3">
      <svg
        viewBox="0 0 920 330"
        className="h-auto w-full"
        role="img"
        aria-label="SMC liquidity sweep, order block, BOS and FVG sequence"
      >
        <defs>
          <linearGradient id="greenArea" x1="0" x2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="redArea" x1="0" x2="1">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0.17" />
          </linearGradient>
        </defs>
        <rect width="920" height="330" rx="18" fill="#0e0b1c" />
        {[70, 140, 210, 280].map((y) => (
          <line
            key={y}
            x1="30"
            y1={y}
            x2="890"
            y2={y}
            stroke="#a78bfa"
            strokeOpacity="0.12"
          />
        ))}
        <rect
          x="55"
          y="145"
          width="190"
          height="70"
          rx="10"
          fill="url(#greenArea)"
          stroke="#a78bfa"
          strokeOpacity="0.4"
        />
        <path
          d="M45 190 L90 175 L125 195 L160 165 L195 188 L230 150 L265 172 L300 105 L330 230 L365 180 L400 155 L440 115 L475 142 L510 90 L550 65 L590 112 L625 82 L660 55 L700 80 L735 48 L770 75 L810 40 L850 55"
          fill="none"
          stroke="#c4b5fd"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="55"
          y1="215"
          x2="245"
          y2="215"
          stroke="#fb7185"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <text x="60" y="235" fill="#fb7185" fontSize="11">
          SSL · equal lows
        </text>
        <line
          x1="650"
          y1="48"
          x2="855"
          y2="48"
          stroke="#4ade80"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <text x="655" y="34" fill="#4ade80" fontSize="11">
          BSL · target
        </text>
        <circle cx="265" cy="172" r="5" fill="#fbbf24" />
        <text x="245" y="155" fill="#fbbf24" fontSize="11">
          IDM
        </text>
        <circle cx="330" cy="230" r="6" fill="#fb7185" />
        <text x="292" y="258" fill="#fb7185" fontSize="11">
          SSL sweep
        </text>
        <rect
          x="350"
          y="165"
          width="75"
          height="35"
          rx="7"
          fill="url(#greenArea)"
          stroke="#4ade80"
          strokeWidth="1.5"
        />
        <text x="366" y="188" fill="#4ade80" fontSize="11">
          OB
        </text>
        <line
          x1="400"
          y1="155"
          x2="400"
          y2="90"
          stroke="#4ade80"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <text x="410" y="108" fill="#4ade80" fontSize="11">
          BOS
        </text>
        <rect
          x="450"
          y="95"
          width="65"
          height="28"
          rx="6"
          fill="url(#redArea)"
          stroke="#e879f9"
          strokeWidth="1.5"
        />
        <text x="469" y="113" fill="#e879f9" fontSize="11">
          FVG
        </text>
        <text x="90" y="125" fill="#a1a1aa" fontSize="11">
          ACCUMULATION
        </text>
        <text x="580" y="145" fill="#a1a1aa" fontSize="11">
          DISTRIBUTION
        </text>
        <text x="335" y="302" fill="#a1a1aa" fontSize="10" letterSpacing="1.2">
          LIQUIDITY → MANIPULATION → STRUCTURE SHIFT → DISPLACEMENT → TARGET
        </text>
      </svg>
    </div>
  );
}

export default function SMCPage() {
  return (
    <main
      className="min-h-screen bg-[#0b0718] text-zinc-100"
      style={{ fontFamily: FONT_DISPLAY }}
    >
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className={`group inline-flex items-center gap-3 rounded-xl ${softCard} px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-300 transition-all hover:border-violet-400/50 hover:text-violet-200 sm:px-6`}
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.8}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Dashboard
          </Link>
          <div
            className={`inline-flex items-center gap-3 rounded-xl ${softCard} px-4 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-violet-200 sm:px-6`}
          >
            The Millionaire Diary
          </div>
        </div>
        <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-5">
              <div className={`rounded-2xl ${card} p-5`}>
                <div className="mb-7 flex items-center gap-2">
                  <BookOpen
                    size={15}
                    strokeWidth={1.8}
                    className="text-violet-300"
                  />
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-violet-300">
                    Smart Money Concepts
                  </span>
                </div>
                <nav className="space-y-6">
                  {sidebarGroups.map((group) => (
                    <div key={group.title}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                          {group.title}
                        </span>
                        <span className="h-px flex-1 bg-violet-400/15" />
                      </div>
                      <div className="space-y-0.5">
                        {group.links.map(([id, label]) => (
                          <a
                            key={id}
                            href={`#${id}`}
                            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-medium leading-[1.4] text-zinc-400 transition-colors hover:bg-violet-400/10 hover:text-violet-200"
                          >
                            <ChevronRight
                              size={10}
                              strokeWidth={1.8}
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                            />
                            <span>{label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
          <div className="min-w-0">
            <section className={`rounded-3xl ${card} p-6 sm:p-8 lg:p-10`}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-violet-200"
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  XAUUSD
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-fuchsia-300">
                  NY Kill Zone
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  One Trade Per Day
                </span>
              </div>
              <div className="mt-6 max-w-4xl">
                <h1
                  className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-transparent sm:text-4xl"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  Smart Money Concepts
                </h1>
                <p className="mt-5 max-w-3xl text-[12px] font-normal leading-[1.8] tracking-[0.005em] text-zinc-400">
                  A single reference, ordered from foundational structure to
                  advanced execution filters. Read top to bottom once, then use
                  the sidebar as a lookup during review.
                </p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Framework",
                    value: "03 Levels",
                    color: "hover:border-violet-400/40",
                  },
                  {
                    label: "Concepts",
                    value: "24 Concepts",
                    color: "hover:border-fuchsia-400/40",
                  },
                  {
                    label: "Instrument",
                    value: "XAUUSD",
                    color: "hover:border-indigo-400/40",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl ${softCard} px-4 py-3 transition-colors ${item.color}`}
                  >
                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                      {item.label}
                    </p>
                    <p
                      className="mt-1 text-lg font-medium tracking-[-0.02em] text-zinc-100"
                      style={{ fontFamily: FONT_NUMBERS }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <HeroDiagram />
            </section>
            <section className="mt-6">
              <div
                className={`rounded-2xl ${card} p-5 sm:p-6 hover:border-violet-400/30`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.8}
                    className="text-violet-300"
                  />
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-300">
                    Signal Hierarchy
                  </p>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    {
                      number: "01",
                      title: "Liquidity sweep",
                      desc: "Confirmation",
                    },
                    {
                      number: "02",
                      title: "Order block",
                      desc: "Execution address",
                    },
                    {
                      number: "03",
                      title: "BOS / CHoCH",
                      desc: "Confirms structure shifted",
                    },
                  ].map((item) => (
                    <div
                      key={item.number}
                      className={`flex items-start gap-3 rounded-xl ${softCard} p-3.5`}
                    >
                      <span
                        className="text-[12px] font-medium text-violet-300"
                        style={{ fontFamily: FONT_NUMBERS }}
                      >
                        {item.number}
                      </span>
                      <div>
                        <p className="text-[11px] font-medium text-zinc-200">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[10px] leading-[1.5] text-zinc-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <div className="mt-12 space-y-14">
              {sections.map((section) => (
                <Section key={section.id} {...section} />
              ))}
            </div>
            <section className="mt-14">
              <div className={`rounded-3xl ${card} p-6 sm:p-8`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${softCard}`}
                  >
                    <Target
                      size={18}
                      strokeWidth={1.7}
                      className="text-violet-300"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-violet-300">
                      Execution Framework
                    </p>
                    <h2
                      className="mt-2 text-2xl font-medium tracking-[-0.025em] text-zinc-100"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      Context before entry
                    </h2>
                    <p className="mt-3 max-w-3xl text-[12px] leading-[1.75] text-zinc-400">
                      Do not treat individual SMC concepts as standalone
                      signals. Build the trade from higher-timeframe context,
                      liquidity, session timing, structure, displacement and
                      finally the execution address.
                    </p>
                  </div>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                  {[
                    ["01", "HTF Bias"],
                    ["02", "Liquidity"],
                    ["03", "Session"],
                    ["04", "Structure"],
                    ["05", "Execution"],
                  ].map(([number, label]) => (
                    <div
                      key={number}
                      className={`rounded-xl ${softCard} px-3 py-3`}
                    >
                      <span
                        className="text-[10px] font-medium text-violet-300"
                        style={{ fontFamily: FONT_NUMBERS }}
                      >
                        {number}
                      </span>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <footer className="mt-12 border-t border-violet-400/15 pt-7 pb-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-2">
                  <Layers3
                    size={14}
                    strokeWidth={1.7}
                    className="text-zinc-500"
                  />
                  <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Trading Edge · SMC Field Manual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3
                    size={13}
                    strokeWidth={1.7}
                    className="text-zinc-500"
                  />
                  <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                    Review · Test · Refine
                  </span>
                </div>
              </div>
              <p className="mt-5 max-w-4xl text-[11px] leading-[1.7] text-zinc-500">
                Reference sheet — not a substitute for a tracked sample.
                Concepts here become edge only after they are coded into
                explicit, testable conditions and validated against a meaningful
                trade count.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
