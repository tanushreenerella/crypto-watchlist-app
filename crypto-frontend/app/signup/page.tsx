"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage, registerUser } from "../../lib/api";
import { getStoredToken } from "../../lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setSuccess("");
      setError("Enter email, password, and confirm password.");
      return;
    }

    if (password !== confirmPassword) {
      setSuccess("");
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setSuccess("");
      setError("Use a password with at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      await registerUser(email.trim(), password);
      setSuccess("Account created. You can sign in now.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      window.setTimeout(() => {
        router.replace("/login");
      }, 900);
    } catch (error) {
      const apiError = getApiErrorMessage(error);
      setError(apiError.message);
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
            Create your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Register with the FastAPI backend, then continue to the protected
            watchlist dashboard.
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
              placeholder="At least 6 characters"
              disabled={isSubmitting}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-text)]">
              Confirm password
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
              placeholder="Repeat your password"
              disabled={isSubmitting}
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--color-text)] transition hover:text-[var(--color-accent)]"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
