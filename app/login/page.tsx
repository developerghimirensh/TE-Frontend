"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, UserRound } from "lucide-react";

import { login as apiLogin } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const FONT_DISPLAY = "var(--font-space-grotesk), sans-serif";
const FONT_NUMBERS = "var(--font-inter), sans-serif";

const displayFontStyle = {
  fontFamily: FONT_DISPLAY,
  letterSpacing: "0.035em",
} as const;

const numberFontStyle = {
  fontFamily: FONT_NUMBERS,
  letterSpacing: "0.015em",
} as const;

const inputClass = `
  h-10 w-full rounded-xl
  border border-violet-400/35
  bg-[#15122a]
  px-3 text-sm text-violet-50
  outline-none
  placeholder:text-violet-300/55
  transition-all duration-300
  shadow-[inset_0_2px_5px_rgba(5,4,17,0.48),inset_0_0_18px_rgba(139,92,246,0.08),0_0_0_1px_rgba(167,139,250,0.05)]
  focus:border-violet-300/80
  focus:ring-2 focus:ring-violet-500/15
  focus:shadow-[inset_0_2px_5px_rgba(5,4,17,0.4),inset_0_0_20px_rgba(139,92,246,0.15),0_0_18px_rgba(139,92,246,0.10)]
  disabled:cursor-not-allowed disabled:opacity-60
`;

const labelClass =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.13em] text-violet-200/80";

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter your username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiLogin({
        username: trimmedUsername,
        password,
      });
      authLogin(response);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0b0718] px-4 py-4 text-[#f1efff] selection:bg-violet-500/30 sm:px-6"
      style={numberFontStyle}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-violet-600/[0.10] blur-[120px]" />
        <div className="absolute -bottom-48 -right-36 h-[460px] w-[460px] rounded-full bg-fuchsia-600/[0.08] blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.07)_0%,transparent_68%)]" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        {/* Desktop brand panel */}
        <section className="hidden lg:block">
          <Link
            href="/login"
            className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-violet-400/30 bg-[#191531]/90 px-4 py-3 transition-all duration-300 hover:border-violet-300/70 hover:shadow-[0_0_28px_rgba(139,92,246,0.13)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/35 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/15 text-violet-200 shadow-[inset_0_0_12px_rgba(139,92,246,0.12),0_0_18px_rgba(139,92,246,0.10)]">
              <LockKeyhole size={20} />
            </div>
            <div>
              <p
                className="text-base font-bold uppercase tracking-[0.08em] text-white"
                style={displayFontStyle}
              >
                The Millionaire Diary
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-violet-300/75">
                Your trading edge
              </p>
            </div>
          </Link>

          <div className="max-w-md">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-300/80">
              Welcome back, trader
            </p>
            <h1
              className="text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-5xl"
              style={displayFontStyle}
            >
              Your next decision starts with{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                discipline.
              </span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-violet-200/60">
              Sign in to review your journal, learn from each position, and
              track your progress over time.
            </p>
            <div className="mt-7 flex items-center gap-3 text-xs text-violet-200/70">
              <span className="h-px w-10 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
              Trade with discipline · Grow with consistency
            </div>
          </div>
        </section>

        {/* Login card */}
        <section className="mx-auto w-full max-w-lg">
          {/* Compact mobile brand */}
          <div className="mb-3 text-center lg:hidden">
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 rounded-xl border border-violet-400/30 bg-[#191531]/90 px-4 py-2.5 shadow-[0_0_22px_rgba(139,92,246,0.08)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300/30 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/15 text-violet-200">
                <LockKeyhole size={16} />
              </span>
              <span
                className="text-sm font-bold uppercase tracking-[0.07em] text-white"
                style={displayFontStyle}
              >
                The Millionaire Diary
              </span>
            </Link>
          </div>

          <div className="rounded-3xl border border-violet-400/35 bg-[#121026]/95 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_0_35px_rgba(139,92,246,0.055),0_16px_45px_rgba(0,0,0,0.42),0_0_0_1px_rgba(167,139,250,0.06)] backdrop-blur-xl sm:p-6">
            <div className="mb-4">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/[0.10] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-200">
                  Secure access
                </span>
              </div>

              <h2
                className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-indigo-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-[28px]"
                style={displayFontStyle}
              >
                Welcome back<span className="text-violet-300">.</span>
              </h2>
              <p className="mt-1 text-xs leading-5 text-violet-200/60 sm:text-sm">
                Sign in to review your trades and track your performance.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-3 whitespace-pre-line rounded-xl border border-rose-400/30 bg-rose-500/[0.08] px-3 py-2 text-xs leading-5 text-rose-300 shadow-[inset_0_0_16px_rgba(244,63,94,0.04)]"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username
                </label>
                <div className="relative">
                  <UserRound
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300/60"
                  />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    disabled={loading}
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300/60"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-violet-300/65 transition hover:bg-violet-400/10 hover:text-violet-100 disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-1 flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-violet-300/50 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 px-4 text-sm font-semibold text-white shadow-[0_5px_20px_rgba(109,40,217,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200/80 hover:shadow-[0_8px_28px_rgba(139,92,246,0.32),0_0_20px_rgba(139,92,246,0.16)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.10] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <span className="text-violet-100/80 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 border-t border-violet-400/20 pt-3 text-center">
              <p className="text-xs text-violet-200/60 sm:text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-violet-300 underline-offset-4 transition-colors duration-200 hover:text-fuchsia-300 hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-3 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-violet-300/45 lg:hidden">
            Trade with discipline · Grow with consistency
          </p>
        </section>
      </div>
    </main>
  );
}
