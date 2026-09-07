"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { register } from "@/lib/api";

const FONT_DISPLAY =
  '"Lucida Fax", "Lucida Bright", Georgia, serif';

const FONT_NUMBERS =
  '"Rubik", "Gotham", Arial, sans-serif';

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedUsername = username.trim();

    // First name validation
    if (!trimmedFirstName) {
      setError("Please enter your first name.");
      return;
    }

    // Last name validation
    if (!trimmedLastName) {
      setError("Please enter your last name.");
      return;
    }

    // Username validation
    if (!trimmedUsername) {
      setError("Please enter a username.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        username: trimmedUsername,
        password,
      });

      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-5"
      style={{
        background: "#eef1f5",
        fontFamily: FONT_NUMBERS,
      }}
    >
      <div className="w-full max-w-md">


        {/* Register Card */}
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

            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4">

              {/* First Name */}
              <div>
                <label
                  htmlFor="first-name"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  First name
                </label>

                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  placeholder="First name"
                  autoComplete="given-name"
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

              {/* Last Name */}
              <div>
                <label
                  htmlFor="last-name"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Last name
                </label>

                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  placeholder="Last name"
                  autoComplete="family-name"
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

            </div>

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
                  autoComplete="new-password"
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

              <p className="mt-2 text-xs text-zinc-400">
                Minimum 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Confirm password
              </label>

              <div className="relative">

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
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
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
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
                  {showConfirmPassword ? (
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login */}
          <div
            className="
              mt-6
              border-t border-zinc-300/60
              pt-5
              text-center
            "
          >
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}

              <Link
                href="/login"
                className="
                  font-semibold
                  text-zinc-800
                  transition-colors
                  hover:text-green-700
                  hover:underline
                  underline-offset-4
                "
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
