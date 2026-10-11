"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  LogOut,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  getAnalytics,
  getStoredUser,
  logout,
  type Analytics,
  type User,
} from "@/lib/api";

const FONT_DISPLAY = '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const FONT_NUMBERS = '"Geist Mono", "SFMono-Regular", Consolas, monospace';
const SURFACE = "bg-[#0b0718] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.18),_transparent_58%)]";
const PANEL = "border border-violet-400/35 bg-gradient-to-br from-[#191333] via-[#121026] to-[#0f0b20] shadow-[inset_0_1px_0_rgba(196,181,253,0.12),inset_0_-18px_35px_rgba(91,33,182,0.08),0_12px_35px_rgba(0,0,0,0.28),0_0_18px_rgba(139,92,246,0.07)]";
const INSET = "border border-violet-400/30 bg-gradient-to-br from-[#17102e] via-[#100c23] to-[#0b0819] shadow-[inset_0_2px_0_rgba(196,181,253,0.12),inset_0_0_22px_rgba(124,58,237,0.12),inset_0_-8px_18px_rgba(0,0,0,0.22)]";
const POSITIVE = "text-emerald-300";
const NEGATIVE = "text-rose-300";

function formatNumber(value: string | number | null | undefined) {
  const number = Number(value ?? 0);
  return Number.isFinite(number)
    ? number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "0.00";
}
function formatInteger(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString();
}
function formatPercent(value: number | null | undefined) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}
function dateLabel(value?: string | null) {
  if (!value) return "No data yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No data yet" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300" style={{ fontFamily: FONT_NUMBERS }}>{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl" style={{ fontFamily: FONT_DISPLAY }}>{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-200/75">{description}</p>}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, positive }: { label: string; value: string; icon: React.ElementType; positive?: boolean }) {
  return (
    <article className={`${PANEL} group min-w-0 rounded-2xl p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/50 sm:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200/75 sm:text-[11px]">{label}</p>
          <p className={`mt-3 break-words text-xl font-semibold tracking-[-0.04em] tabular-nums sm:text-2xl ${positive === true ? POSITIVE : positive === false ? NEGATIVE : "text-violet-50"}`} style={{ fontFamily: FONT_NUMBERS }}>{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-400/20 via-violet-500/10 to-fuchsia-500/10 text-violet-200 transition group-hover:bg-violet-400/[0.13]">
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>
    </article>
  );
}

function SectionCard({ title, icon: Icon, children, className = "" }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <section className={`${PANEL} min-w-0 rounded-2xl p-5 sm:p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-3 border-b border-violet-400/40 pb-4 shadow-[0_1px_0_rgba(139,92,246,0.08)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-400/20 via-violet-500/10 to-fuchsia-500/10 text-violet-200"><Icon size={17} strokeWidth={1.8} /></span>
        <h2 className="bg-gradient-to-r from-violet-100 via-fuchsia-200 to-indigo-200 bg-clip-text text-base font-semibold tracking-[-0.025em] text-transparent sm:text-lg" style={{ fontFamily: FONT_DISPLAY }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.055] py-3 last:border-b-0">
      <span className="text-xs text-violet-200/75 sm:text-[13px]">{label}</span>
      <span className="max-w-[65%] break-words text-right text-xs font-medium text-violet-100/90 sm:text-[13px]" style={{ fontFamily: mono ? FONT_NUMBERS : FONT_DISPLAY }}>{value}</span>
    </div>
  );
}

function PnlTile({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div className={`${INSET} rounded-xl p-4`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200/75">{label}</p>
      <p className={`mt-2 break-words text-lg font-semibold tracking-[-0.03em] tabular-nums sm:text-xl ${positive ? POSITIVE : NEGATIVE}`} style={{ fontFamily: FONT_NUMBERS }}>{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");
        const storedUser = getStoredUser();
        if (!storedUser) {
          setError("Your session could not be found. Please log in again.");
          return;
        }
        setUser(storedUser);
        try {
          setAnalytics(await getAnalytics());
        } catch {
          setAnalytics(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const fullName = useMemo(() => {
    if (!user) return "";
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
    return name || user.username;
  }, [user]);
  const netPnl = Number(analytics?.net_pnl ?? 0);
  const grossPnl = Number(analytics?.gross_pnl ?? 0);
  const totalFees = Number(analytics?.total_fees ?? 0);
  const bestDay = analytics?.best_trading_day;
  const worstDay = analytics?.worst_trading_day;
  const averageHoldingHours = Number(analytics?.average_holding_time?.average_seconds ?? 0) / 3600;

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  if (loading) {
    return <main className={`min-h-screen ${SURFACE} px-4 py-10 text-violet-50 sm:px-6`} style={{ fontFamily: FONT_DISPLAY }}><div className="mx-auto flex min-h-[65vh] max-w-6xl items-center justify-center"><div className={`${PANEL} rounded-2xl px-8 py-7 text-sm text-violet-100/85`}><span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-violet-300" />Loading your profile...</div></div></main>;
  }

  if (error || !user) {
    return (
      <main className={`min-h-screen ${SURFACE} px-4 py-10 text-violet-50 sm:px-6`} style={{ fontFamily: FONT_DISPLAY }}>
        <div className="mx-auto flex min-h-[65vh] max-w-6xl items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-rose-300/30 bg-gradient-to-br from-[#191126] via-[#121026] to-[#0d091b] p-7 text-center shadow-[inset_0_1px_0_rgba(251,113,133,0.10),0_16px_45px_rgba(0,0,0,0.3)]">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-400/[0.08] text-rose-300"><ShieldCheck size={22} /></span>
            <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">Profile unavailable</h1>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-violet-200/75">{error || "Please log in again."}</p>
            <Link href="/login" className="mt-6 inline-flex items-center justify-center rounded-xl border border-violet-400/45 bg-gradient-to-r from-violet-600/30 via-fuchsia-500/15 to-indigo-500/25 px-5 py-3 text-sm font-semibold text-violet-100 transition hover:from-violet-500/40 hover:via-fuchsia-500/25 hover:to-indigo-500/35">Go to Login</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${SURFACE} px-4 py-6 text-violet-50 sm:px-6 sm:py-8 lg:px-8`} style={{ fontFamily: FONT_DISPLAY }}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-violet-200/75 transition hover:text-violet-200"><ArrowLeft size={15} />Back to Dashboard</Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300" style={{ fontFamily: FONT_NUMBERS }}>The Millionaire Diary / Account</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl lg:text-[42px]" style={{ fontFamily: FONT_DISPLAY }}>Hello, <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">{fullName}</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-200/75">Your account details and trading performance, in one place.</p>
          </div>
          <button type="button" onClick={handleLogout} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-rose-300/15 bg-rose-400/[0.06] px-4 py-2.5 text-sm font-medium text-rose-200 transition hover:border-rose-300/30 hover:bg-rose-400/[0.12]"><LogOut size={16} />Logout</button>
        </header>

        <section className={`${PANEL} mb-6 overflow-hidden rounded-3xl p-5 sm:p-7`}>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-400/35 bg-gradient-to-br from-violet-400/25 via-fuchsia-500/10 to-indigo-500/15 shadow-[inset_0_2px_8px_rgba(196,181,253,0.15),inset_0_-8px_18px_rgba(91,33,182,0.16),0_0_20px_rgba(139,92,246,0.12)] text-violet-200 sm:h-20 sm:w-20"><UserRound size={32} strokeWidth={1.5} /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200/75">The Millionaire Diary Trader</p>
                <h2 className="mt-1 break-words text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">{fullName}</h2>
                <p className="mt-1 text-sm text-violet-200" style={{ fontFamily: FONT_NUMBERS }}>@{user.username}</p>
                <p className="mt-1 text-[11px] text-violet-300/60" style={{ fontFamily: FONT_NUMBERS }}>Account #{user.id}</p>
              </div>
            </div>
            <div className={`${INSET} rounded-2xl p-5 md:min-w-[250px]`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/75">Net P&amp;L</p>
              <div className="mt-2 flex items-center gap-2">
                {netPnl >= 0 ? <TrendingUp size={21} className={POSITIVE} /> : <TrendingDown size={21} className={NEGATIVE} />}
                <span className={`break-words text-2xl font-semibold tracking-[-0.045em] tabular-nums sm:text-3xl ${netPnl >= 0 ? POSITIVE : NEGATIVE}`} style={{ fontFamily: FONT_NUMBERS }}>{netPnl >= 0 ? "+" : "−"}${formatNumber(Math.abs(netPnl))}</span>
              </div>
              <p className="mt-2 text-xs text-violet-300/60">Overall trading result</p>
            </div>
          </div>
        </section>

        {analytics && <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Trades" value={formatInteger(analytics.total_trades)} icon={BarChart3} />
          <StatCard label="Win Rate" value={formatPercent(analytics.win_rate)} icon={Target} positive={analytics.win_rate >= 50} />
          <StatCard label="Gross P&L" value={`${grossPnl >= 0 ? "+" : "−"}$${formatNumber(Math.abs(grossPnl))}`} icon={grossPnl >= 0 ? TrendingUp : TrendingDown} positive={grossPnl >= 0} />
          <StatCard label="Total Fees" value={`$${formatNumber(totalFees)}`} icon={Wallet} />
        </section>}

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <SectionCard title="Account Information" icon={UserRound}>
            <InfoRow label="Full Name" value={fullName} />
            <InfoRow label="First Name" value={user.first_name || "Not provided"} />
            <InfoRow label="Last Name" value={user.last_name || "Not provided"} />
            <InfoRow label="Username" value={`@${user.username}`} />
            <InfoRow label="User ID" value={`#${user.id}`} mono />
            <InfoRow label="Account Type" value="Trading Account" />
            <InfoRow label="Platform" value="The Millionaire Diary" />
          </SectionCard>

          <SectionCard title="Performance Summary" icon={BarChart3}>
            {analytics ? <>
              <InfoRow label="Winning Trades" value={formatInteger(analytics.winning_trades)} mono />
              <InfoRow label="Losing Trades" value={formatInteger(analytics.losing_trades)} mono />
              <InfoRow label="Breakeven Trades" value={formatInteger(analytics.breakeven_trades)} mono />
              <InfoRow label="Profit Factor" value={analytics.profit_factor ? formatNumber(analytics.profit_factor) : "N/A"} mono />
            </> : <p className="text-sm leading-6 text-violet-200/75">Performance data is currently unavailable.</p>}
          </SectionCard>

          <SectionCard title="Profit & Loss" icon={Wallet}>
            {analytics ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PnlTile label="Gross Profit" value={`+$${formatNumber(analytics.gross_profit)}`} positive />
              <PnlTile label="Gross Loss" value={`−$${formatNumber(Math.abs(Number(analytics.gross_loss)))}`} positive={false} />
              <PnlTile label="Average Win" value={`+$${formatNumber(analytics.average_win)}`} positive />
              <PnlTile label="Average Loss" value={`−$${formatNumber(Math.abs(Number(analytics.average_loss)))}`} positive={false} />
            </div> : <p className="text-sm leading-6 text-violet-200/75">P&amp;L data is currently unavailable.</p>}
          </SectionCard>

          <SectionCard title="Trading Habits" icon={CalendarDays}>
            {analytics ? <>
              <InfoRow label="Trading Days" value={formatInteger(analytics.trade_frequency.trading_days)} mono />
              <InfoRow label="Trades / Day" value={formatNumber(analytics.trade_frequency.average_trades_per_day)} mono />
              <InfoRow label="Trades / Week" value={formatNumber(analytics.trade_frequency.trades_per_week)} mono />
              <InfoRow label="Trades / Month" value={formatNumber(analytics.trade_frequency.trades_per_month)} mono />
              <InfoRow label="Avg. Holding Time" value={averageHoldingHours < 1 ? `${(averageHoldingHours * 60).toFixed(0)} min` : `${averageHoldingHours.toFixed(1)} hrs`} mono />
            </> : <p className="text-sm leading-6 text-violet-200/75">Trading habit data is currently unavailable.</p>}
          </SectionCard>
        </div>

        {analytics && <section className="mt-4 grid gap-4 md:grid-cols-2">
          <article className={`${PANEL} rounded-2xl p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200/75">Best Trading Day</p><h3 className="mt-2 text-lg font-semibold text-violet-50" style={{ fontFamily: FONT_NUMBERS }}>{dateLabel(bestDay?.date)}</h3></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/30 bg-gradient-to-br from-emerald-400/15 to-emerald-900/10 shadow-[inset_0_1px_0_rgba(167,243,208,0.12)] text-emerald-300"><TrendingUp size={19} /></span>
            </div>
            <p className={`mt-5 text-2xl font-semibold tracking-[-0.04em] tabular-nums ${POSITIVE}`} style={{ fontFamily: FONT_NUMBERS }}>{bestDay ? `+$${formatNumber(Math.abs(Number(bestDay.pnl)))}` : "—"}</p>
          </article>
          <article className={`${PANEL} rounded-2xl p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200/75">Worst Trading Day</p><h3 className="mt-2 text-lg font-semibold text-violet-50" style={{ fontFamily: FONT_NUMBERS }}>{dateLabel(worstDay?.date)}</h3></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-300/30 bg-gradient-to-br from-rose-400/15 to-rose-900/10 shadow-[inset_0_1px_0_rgba(253,164,175,0.12)] text-rose-300"><TrendingDown size={19} /></span>
            </div>
            <p className={`mt-5 text-2xl font-semibold tracking-[-0.04em] tabular-nums ${NEGATIVE}`} style={{ fontFamily: FONT_NUMBERS }}>{worstDay ? `−$${formatNumber(Math.abs(Number(worstDay.pnl)))}` : "—"}</p>
          </article>
        </section>}

        {analytics && <SectionCard title="Trading Streaks" icon={Target} className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`${INSET} rounded-xl p-4`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200/75">Winning Streak</p>
              <p className={`mt-2 text-3xl font-semibold tracking-[-0.05em] tabular-nums ${POSITIVE}`} style={{ fontFamily: FONT_NUMBERS }}>{analytics.winning_streak}</p>
              <p className="mt-1 text-xs text-violet-300/60">Consecutive wins</p>
            </div>
            <div className={`${INSET} rounded-xl p-4`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200/75">Losing Streak</p>
              <p className={`mt-2 text-3xl font-semibold tracking-[-0.05em] tabular-nums ${NEGATIVE}`} style={{ fontFamily: FONT_NUMBERS }}>{analytics.losing_streak}</p>
              <p className="mt-1 text-xs text-violet-300/60">Consecutive losses</p>
            </div>
          </div>
        </SectionCard>}

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/dashboard" className="group flex items-center justify-center gap-2 rounded-xl border border-violet-400/35 bg-gradient-to-br from-violet-500/15 via-violet-500/[0.07] to-fuchsia-500/10 px-5 py-3.5 text-sm font-semibold text-violet-100/90 transition hover:border-violet-300/75 hover:bg-violet-400/[0.18] hover:text-white"><BarChart3 size={17} className="text-violet-200" />Go to Dashboard</Link>
          <Link href="/trades" className="group flex items-center justify-center gap-2 rounded-xl border border-violet-400/35 bg-gradient-to-br from-violet-500/15 via-violet-500/[0.07] to-fuchsia-500/10 px-5 py-3.5 text-sm font-semibold text-violet-100/90 transition hover:border-violet-300/75 hover:bg-violet-400/[0.18] hover:text-white"><BarChart3 size={17} className="text-violet-200" />View My Trades</Link>
        </section>

        <footer className="py-8 text-center">
          <p className="text-[10px] font-medium tracking-[0.08em] text-violet-300/60">THE MILLIONAIRE DIARY <span className="mx-2 text-violet-400">·</span> Trade with discipline. Learn from every trade.</p>
        </footer>
      </div>
    </main>
  );
}
