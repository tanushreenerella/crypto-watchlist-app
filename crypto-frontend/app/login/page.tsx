"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage, loginUser } from "../../lib/api";
import { getStoredToken, setStoredToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  const token = getStoredToken();
  if (token) {
    router.replace("/dashboard");
  }
}, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const { access_token } = await loginUser(email.trim(), password);
      setStoredToken(access_token);
      router.replace("/dashboard");
    } catch (error) {
      const apiError = getApiErrorMessage(error);
      setError(
        apiError.status === 401 ? "Invalid email or password." : apiError.message
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-surface)] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_28%)]" />

      <section className="relative w-full max-w-md rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur">
        <div className="mb-8">
          <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Crypto Watchlist
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            Sign in to your dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Track your selected coins with a simple, protected workspace backed
            by your FastAPI service.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-text)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-text-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[var(--color-text)] transition hover:text-[var(--color-accent)]"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
