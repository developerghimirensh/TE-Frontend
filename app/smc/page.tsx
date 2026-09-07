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

const neutralShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.20),-8px_-8px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.25),-10px_-10px_24px_rgba(255,255,255,1)]";

const insetShadow =
  "shadow-[inset_5px_5px_12px_rgba(163,177,198,0.16),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]";

const profitShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.18),-8px_-8px_18px_rgba(255,255,255,0.95),0_4px_16px_rgba(21,128,61,0.12)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.22),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(21,128,61,0.28)]";

const lossShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.18),-8px_-8px_18px_rgba(255,255,255,0.95),0_4px_16px_rgba(185,28,28,0.12)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.22),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(185,28,28,0.28)]";

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
    tone: "green",
  },
  {
    id: "intermediate",
    number: "02",
    title: "Intermediate",
    subtitle:
      "Where structure and liquidity concepts combine into a repeatable sequence, and where session timing starts to matter.",
    items: intermediate,
    tone: "gold",
  },
  {
    id: "advanced",
    number: "03",
    title: "Advanced",
    subtitle:
      "Entry precision, model selectivity, and objective filters — the layer that separates a discretionary sketch from a repeatable, testable model.",
    items: advanced,
    tone: "red",
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
  if (tone === "green") {
    return {
      number: "text-green-700",
      line: "bg-green-700/70",
      border: "hover:border-green-600/70",
      shadow:
        "hover:shadow-[10px_10px_24px_rgba(163,177,198,0.23),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(21,128,61,0.20)]",
      chip: "bg-green-700/8 text-green-800 border-green-700/15",
    };
  }

  if (tone === "gold") {
    return {
      number: "text-amber-700",
      line: "bg-amber-700/70",
      border: "hover:border-amber-700/60",
      shadow:
        "hover:shadow-[10px_10px_24px_rgba(163,177,198,0.23),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(154,106,22,0.20)]",
      chip: "bg-amber-700/8 text-amber-800 border-amber-700/15",
    };
  }

  return {
    number: "text-red-700",
    line: "bg-red-700/70",
    border: "hover:border-red-600/70",
    shadow:
      "hover:shadow-[10px_10px_24px_rgba(163,177,198,0.23),-10px_-10px_24px_rgba(255,255,255,1),0_7px_28px_rgba(185,28,28,0.20)]",
    chip: "bg-red-700/8 text-red-800 border-red-700/15",
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
  const id = slugify(concept.name);

  return (
    <article
      id={id}
      className={`scroll-mt-8 rounded-2xl border border-zinc-300/70 bg-[#eef1f5] p-5 transition-all duration-300 ${neutralShadow} ${styles.border} ${styles.shadow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`font-[${FONT_NUMBERS}] text-[10px] font-medium tracking-[0.12em] ${styles.number}`}
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
            className="text-[15px] font-medium tracking-[-0.01em] text-zinc-900"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {concept.name}
          </h3>
        </div>

        <CircleDot
          size={14}
          strokeWidth={1.7}
          className="mt-1 shrink-0 text-zinc-400"
        />
      </div>

      <div className="mt-5">
        <p className="text-[12px] font-normal leading-[1.7] tracking-[0.005em] text-zinc-700">
          {concept.definition}
        </p>

        <div className="mt-4 border-t border-zinc-300/60 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            Why it matters
          </p>

          <p className="mt-1.5 text-[11px] font-normal leading-[1.65] text-zinc-600">
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
            className="text-2xl font-medium tracking-[-0.025em] text-zinc-900"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {title}
          </h2>

          <p className="mt-2 max-w-3xl text-[12px] font-normal leading-[1.7] tracking-[0.005em] text-zinc-600">
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
    <div
      className={`mt-7 overflow-hidden rounded-2xl border border-zinc-300/70 bg-[#eef1f5] p-3 ${insetShadow}`}
    >
      <svg
        viewBox="0 0 920 330"
        className="h-auto w-full"
        role="img"
        aria-label="SMC liquidity sweep, order block, BOS and FVG sequence"
      >
        <defs>
          <linearGradient id="greenArea" x1="0" x2="1">
            <stop offset="0%" stopColor="#15803d" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.18" />
          </linearGradient>

          <linearGradient id="redArea" x1="0" x2="1">
            <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="920" height="330" rx="18" fill="#eef1f5" />

        {/* Grid */}
        <line
          x1="30"
          y1="70"
          x2="890"
          y2="70"
          stroke="#a3aebc"
          strokeOpacity="0.18"
        />
        <line
          x1="30"
          y1="140"
          x2="890"
          y2="140"
          stroke="#a3aebc"
          strokeOpacity="0.18"
        />
        <line
          x1="30"
          y1="210"
          x2="890"
          y2="210"
          stroke="#a3aebc"
          strokeOpacity="0.18"
        />
        <line
          x1="30"
          y1="280"
          x2="890"
          y2="280"
          stroke="#a3aebc"
          strokeOpacity="0.18"
        />

        {/* Asian accumulation */}
        <rect
          x="55"
          y="145"
          width="190"
          height="70"
          rx="10"
          fill="url(#greenArea)"
          stroke="#15803d"
          strokeOpacity="0.25"
        />

        {/* Price path */}
        <path
          d="M45 190
             L90 175
             L125 195
             L160 165
             L195 188
             L230 150
             L265 172
             L300 105
             L330 230
             L365 180
             L400 155
             L440 115
             L475 142
             L510 90
             L550 65
             L590 112
             L625 82
             L660 55
             L700 80
             L735 48
             L770 75
             L810 40
             L850 55"
          fill="none"
          stroke="#3f3f46"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* SSL */}
        <line
          x1="55"
          y1="215"
          x2="245"
          y2="215"
          stroke="#b91c1c"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        <text
          x="60"
          y="235"
          fill="#b91c1c"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          SSL · equal lows
        </text>

        {/* BSL */}
        <line
          x1="650"
          y1="48"
          x2="855"
          y2="48"
          stroke="#15803d"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        <text
          x="655"
          y="34"
          fill="#15803d"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          BSL · target
        </text>

        {/* IDM */}
        <circle cx="265" cy="172" r="5" fill="#9a6a16" />

        <text
          x="245"
          y="155"
          fill="#9a6a16"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          IDM
        </text>

        {/* SSL sweep */}
        <circle cx="330" cy="230" r="6" fill="#b91c1c" />

        <text
          x="292"
          y="258"
          fill="#b91c1c"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          SSL sweep
        </text>

        {/* OB */}
        <rect
          x="350"
          y="165"
          width="75"
          height="35"
          rx="7"
          fill="url(#greenArea)"
          stroke="#15803d"
          strokeWidth="1.5"
        />

        <text
          x="366"
          y="188"
          fill="#15803d"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          OB
        </text>

        {/* BOS */}
        <line
          x1="400"
          y1="155"
          x2="400"
          y2="90"
          stroke="#15803d"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        <text
          x="410"
          y="108"
          fill="#15803d"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          BOS
        </text>

        {/* FVG */}
        <rect
          x="450"
          y="95"
          width="65"
          height="28"
          rx="6"
          fill="url(#redArea)"
          stroke="#b91c1c"
          strokeWidth="1.5"
        />

        <text
          x="469"
          y="113"
          fill="#b91c1c"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          FVG
        </text>

        {/* Labels */}
        <text
          x="90"
          y="125"
          fill="#52525b"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          ACCUMULATION
        </text>

        <text
          x="580"
          y="145"
          fill="#52525b"
          fontSize="11"
          fontFamily="Rubik, Arial"
          fontWeight="500"
        >
          DISTRIBUTION
        </text>

        <text
          x="335"
          y="302"
          fill="#71717a"
          fontSize="10"
          fontFamily="Rubik, Arial"
          fontWeight="500"
          letterSpacing="1.2"
        >
          LIQUIDITY → MANIPULATION → STRUCTURE SHIFT → DISPLACEMENT → TARGET
        </text>
      </svg>
    </div>
  );
}

export default function SMCPage() {
  return (
    <main
      className="min-h-screen bg-[#eef1f5] text-zinc-900"
      style={{ fontFamily: FONT_DISPLAY }}
    >
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <div className="mb-6 flex items-center justify-between " >
          <Link
            href="/dashboard"
            className={`group inline-flex items-center gap-3 rounded-lg border
                 border-zinc-300/70 bg-[#eef1f5] px-14 py-3 text-[10px] font-medium 
                 uppercase tracking-[0.20em] text-zinc-600 transition-all duration-300 
                 ${neutralShadow} hover:border-green-600/60 hover:text-green-700`}
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Dashboard
          </Link>

          <div
            className={`group inline-flex items-center gap-3 rounded-xl border
                 border-zinc-300/70 bg-[#eef1f5] px-10 py-3 text-[10px] font-medium 
                 uppercase tracking-[0.20em] text-zinc-600 transition-all duration-300 
                 ${neutralShadow} hover:border-green-600/60 hover:text-green-700`}
          >
            
            The Millionaire Diary
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-5">
              <div
                className={`rounded-2xl border border-zinc-300/70 bg-[#eef1f5] p-5 ${neutralShadow}`}
              >
                <div className="mb-7">
                  <div className="mb-2 flex items-center gap-2">
                    <BookOpen
                      size={15}
                      strokeWidth={1.8}
                      className="text-green-700"
                    />

                    <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-green-700">
                      Smart Money Concepts
                    </span>
                  </div>
                </div>

                <nav className="space-y-6">
                  {sidebarGroups.map((group) => (
                    <div key={group.title}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                          {group.title}
                        </span>

                        <span className="h-px flex-1 bg-zinc-300/60" />
                      </div>

                      <div className="space-y-0.5">
                        {group.links.map(([id, label]) => (
                          <a
                            key={id}
                            href={`#${id}`}
                            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-medium leading-[1.4] text-zinc-500 transition-colors duration-200 hover:bg-white/35 hover:text-green-700"
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

          {/* Main */}
          <div className="min-w-0">
            {/* Hero */}
            <section
              className={`rounded-3xl border border-zinc-300/70 bg-[#eef1f5] p-6 sm:p-8 lg:p-10 ${neutralShadow}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border border-zinc-300/70 bg-[#eef1f5] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600"
                  style={{ fontFamily: FONT_NUMBERS }}
                >
                  XAUUSD
                </span>

                <span className="text-zinc-300">·</span>

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-green-700">
                  NY Kill Zone
                </span>

                <span className="text-zinc-300">·</span>

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  One Trade Per Day
                </span>
              </div>

              <div className="mt-6 max-w-4xl">
                <h1
                  className="text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-zinc-900 sm:text-4xl"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  Smart Money Concepts
                </h1>

                <p className="mt-5 max-w-3xl text-[12px] font-normal leading-[1.8] tracking-[0.005em] text-zinc-600">
                  A single reference, ordered from foundational structure to
                  advanced execution filters. Read top to bottom once, then use
                  the sidebar as a lookup during review.
                </p>
              </div>

              {/* Summary stats */}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div
                  className={`rounded-xl border border-zinc-300/70 bg-[#eef1f5] px-4 py-3 ${neutralShadow} hover:border-green-600/60`}
                >
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Framework
                  </p>
                  <p
                    className="mt-1 text-lg font-medium tracking-[-0.02em] text-zinc-900"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    03 Levels
                  </p>
                </div>

                <div
                  className={`rounded-xl border border-zinc-300/70 bg-[#eef1f5] px-4 py-3 ${neutralShadow} hover:border-amber-700/60`}
                >
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Concepts
                  </p>
                  <p
                    className="mt-1 text-lg font-medium tracking-[-0.02em] text-zinc-900"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    24 Concepts
                  </p>
                </div>

                <div
                  className={`rounded-xl border border-zinc-300/70 bg-[#eef1f5] px-4 py-3 ${neutralShadow} hover:border-red-600/60`}
                >
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Instrument
                  </p>
                  <p
                    className="mt-1 text-lg font-medium tracking-[-0.02em] text-zinc-900"
                    style={{ fontFamily: FONT_NUMBERS }}
                  >
                    XAUUSD
                  </p>
                </div>
              </div>

              <HeroDiagram />
            </section>

            {/* Signal hierarchy */}
            <section className="mt-6">
              <div
                className={`rounded-2xl border border-zinc-300/70 bg-[#eef1f5] p-5 sm:p-6 ${profitShadow} hover:border-green-600/70`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.8}
                    className="text-green-700"
                  />

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-green-700">
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
                      className="flex items-start gap-3 rounded-xl border border-zinc-300/60 bg-white/20 p-3.5"
                    >
                      <span
                        className="text-[12px] font-medium text-green-700"
                        style={{ fontFamily: FONT_NUMBERS }}
                      >
                        {item.number}
                      </span>

                      <div>
                        <p className="text-[11px] font-medium text-zinc-800">
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

            {/* Sections */}
            <div className="mt-12 space-y-14">
              {sections.map((section) => (
                <Section key={section.id} {...section} />
              ))}
            </div>

            {/* Execution framework */}
            <section className="mt-14">
              <div
                className={`rounded-3xl border border-zinc-300/70 bg-[#eef1f5] p-6 sm:p-8 ${neutralShadow}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-300/70 bg-[#eef1f5]"
                    style={{
                      boxShadow:
                        "inset 3px 3px 8px rgba(163,177,198,0.14), inset -3px -3px 8px rgba(255,255,255,0.9)",
                    }}
                  >
                    <Target
                      size={18}
                      strokeWidth={1.7}
                      className="text-green-700"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-green-700">
                      Execution Framework
                    </p>

                    <h2
                      className="mt-2 text-2xl font-medium tracking-[-0.025em] text-zinc-900"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      Context before entry
                    </h2>

                    <p className="mt-3 max-w-3xl text-[12px] leading-[1.75] text-zinc-600">
                      Do not treat individual SMC concepts as standalone
                      signals. Build the trade from higher-timeframe context,
                      liquidity, session timing, structure, displacement and
                      finally the execution address.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-3 md:grid-cols-5">
                  {[
                    ["01", "HTF Bias"],
                    ["02", "Liquidity"],
                    ["03", "Session"],
                    ["04", "Structure"],
                    ["05", "Execution"],
                  ].map(([number, label]) => (
                    <div
                      key={number}
                      className="rounded-xl border border-zinc-300/60 bg-[#eef1f5] px-3 py-3"
                    >
                      <span
                        className="text-[10px] font-medium text-green-700"
                        style={{ fontFamily: FONT_NUMBERS }}
                      >
                        {number}
                      </span>

                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 border-t border-zinc-300/70 pt-7 pb-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-2">
                  <Layers3
                    size={14}
                    strokeWidth={1.7}
                    className="text-zinc-400"
                  />

                  <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                    Trading Edge · SMC Field Manual
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3
                    size={13}
                    strokeWidth={1.7}
                    className="text-zinc-400"
                  />

                  <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-400">
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
