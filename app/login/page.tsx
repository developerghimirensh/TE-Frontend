"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { login as apiLogin } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const neutralShadow =
  "shadow-[8px_8px_18px_rgba(163,177,198,0.20),-8px_-8px_18px_rgba(255,255,255,0.95)] hover:shadow-[10px_10px_24px_rgba(163,177,198,0.25),-10px_-10px_24px_rgba(255,255,255,1)]";


const FONT_DISPLAY =
  '"Lucida Fax", "Lucida Bright", Georgia, serif';

const FONT_NUMBERS =
  '"Rubik", "Gotham", Arial, sans-serif';

export default function LoginPage() {
  const router = useRouter();

  const { login: authLogin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: "#eef1f5",
        fontFamily: FONT_NUMBERS,
      }}
    >
      <div className="w-full max-w-md">

        {/* Website Name */}
        <div className="mb-7 text-center">
                <div
            className={`group inline-flex items-center gap-3 rounded-lg border
                 border-zinc-300/70 bg-[#eef1f5] px-20 py-3 text-[12px] font-medium 
                 uppercase tracking-[0.20em] text-zinc-600 transition-all duration-300 
                 ${neutralShadow} hover:border-green-600/60 hover:text-green-700 mb-3`}
          >

            The Millionaire Diary
          </div>
        </div>

        {/* Login Card */}
        <div
          className="
            rounded-3xl
            border border-zinc-300/70
            bg-[#eef1f5]
            p-7
            shadow-[9px_9px_22px_rgba(163,177,198,0.25),-9px_-9px_22px_rgba(255,255,255,0.95)]
          "
        >

          {/* Error */}
          {error && (
            <div
              className="
                mb-5
                rounded-xl
                border border-zinc-300/70
                bg-[#eef1f5]
                px-4 py-3
                text-sm
                text-red-700
                whitespace-pre-line
                shadow-[inset_4px_4px_9px_rgba(163,177,198,0.14),inset_-4px_-4px_9px_rgba(255,255,255,0.8)]
              "
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter your username"
                autoComplete="username"
                disabled={loading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border border-zinc-300/70
                  bg-[#eef1f5]
                  px-4
                  text-sm
                  text-zinc-900
                  outline-none
                  transition-all duration-300
                  placeholder:text-zinc-400
                  shadow-[inset_4px_4px_9px_rgba(163,177,198,0.15),inset_-4px_-4px_9px_rgba(255,255,255,0.9)]
                  focus:border-green-600/60
                  focus:ring-2
                  focus:ring-green-600/10
                  focus:shadow-[inset_5px_5px_11px_rgba(163,177,198,0.18),inset_-5px_-5px_11px_rgba(255,255,255,0.95)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border border-zinc-300/70
                    bg-[#eef1f5]
                    px-4
                    pr-12
                    text-sm
                    text-zinc-900
                    outline-none
                    transition-all duration-300
                    placeholder:text-zinc-400
                    shadow-[inset_4px_4px_9px_rgba(163,177,198,0.15),inset_-4px_-4px_9px_rgba(255,255,255,0.9)]
                    focus:border-green-600/60
                    focus:ring-2
                    focus:ring-green-600/10
                    focus:shadow-[inset_5px_5px_11px_rgba(163,177,198,0.18),inset_-5px_-5px_11px_rgba(255,255,255,0.95)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    p-1.5
                    text-zinc-400
                    transition-all duration-200
                    hover:bg-zinc-200/50
                    hover:text-zinc-700
                    disabled:cursor-not-allowed
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border border-zinc-700/70
                bg-zinc-900
                px-4
                text-sm
                font-semibold
                text-white
                transition-all duration-300
                shadow-[6px_6px_14px_rgba(163,177,198,0.30),-5px_-5px_12px_rgba(255,255,255,0.65)]
                hover:-translate-y-0.5
                hover:border-green-600/70
                hover:bg-zinc-900
                hover:shadow-[8px_8px_18px_rgba(163,177,198,0.28),-7px_-7px_16px_rgba(255,255,255,0.85),0_0_18px_rgba(21,128,61,0.58),0_7px_32px_rgba(21,128,61,0.42)]
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Register */}
          <div
            className="
              mt-6
              border-t border-zinc-300/60
              pt-5
              text-center
            "
          >
            <p className="text-sm text-zinc-500">
              Don't have an account?{" "}

              <Link
                href="/register"
                className="
                  font-semibold
                  text-zinc-800
                  transition-colors
                  hover:text-green-700
                  hover:underline
                  underline-offset-4
                "
              >
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}