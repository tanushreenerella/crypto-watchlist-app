"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addWatchlistCoin,
  deleteWatchlistCoin,
  fetchWatchlist,
  getApiErrorMessage,
  WatchlistItem,
} from "../../lib/api";
import { clearStoredToken, getStoredToken } from "../../lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [coin, setCoin] = useState("");
  const [coins, setCoins] = useState<WatchlistItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  const loadWatchlist = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setError("");
      const data = await fetchWatchlist(token);
      setCoins(data);
    } catch (error) {
      const apiError = getApiErrorMessage(error);

      if (apiError.status === 401 || apiError.status === 403) {
        clearStoredToken();
        router.replace("/login");
        return;
      }

      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadWatchlist();
  }, [loadWatchlist]);
   useEffect(() => {
  if (!mounted) return;
  void loadWatchlist();
}, [mounted, loadWatchlist]);
  async function handleAddCoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!coin.trim()) {
      setError("Enter a coin name before adding it.");
      return;
    }

    const token = getStoredToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setIsAdding(true);
      setError("");

      await addWatchlistCoin(token, coin.trim().toLowerCase());
      setCoin("");
      await loadWatchlist();
    } catch (error) {
      const apiError = getApiErrorMessage(error);

      if (apiError.status === 401 || apiError.status === 403) {
        clearStoredToken();
        router.replace("/login");
        return;
      }

      setError(apiError.message);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDeleteCoin(id: number) {
    const token = getStoredToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteWatchlistCoin(token, id);
      setCoins((currentCoins) => currentCoins.filter((item) => item.id !== id));
    } catch (error) {
      const apiError = getApiErrorMessage(error);

      if (apiError.status === 401 || apiError.status === 403) {
        clearStoredToken();
        router.replace("/login");
        return;
      }

      setError(apiError.message);
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    clearStoredToken();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] px-6 py-6 text-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
                Portfolio overview
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                Crypto Watchlist
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Monitor tracked assets, add new coins to your watchlist, and
                manage everything from one protected dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
          <aside className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Add a coin
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Use a coin slug such as{" "}
                <span className="font-semibold text-[var(--color-text)]">
                  bitcoin
                </span>{" "}
                to fetch the latest USD price from the backend.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleAddCoin}>
              <input
                value={coin}
                onChange={(event) => setCoin(event.target.value)}
                placeholder="bitcoin"
                disabled={isAdding}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
              />

              <button
                type="submit"
                disabled={isAdding}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAdding ? "Adding coin..." : "Add to watchlist"}
              </button>
            </form>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </aside>

          <section className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Your watchlist
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Live entries stored on the backend and fetched with your JWT.
                </p>
              </div>
              <div className="rounded-full bg-[var(--color-panel)] px-3 py-1 text-sm font-medium text-[var(--color-muted)]">
                {coins.length} {coins.length === 1 ? "coin" : "coins"}
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-72 items-center justify-center rounded-[24px] border border-dashed border-[var(--color-border)] bg-[var(--color-panel)]">
                <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-muted)]">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-accent)]" />
                  Loading watchlist...
                </div>
              </div>
            ) : coins.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--color-border)] bg-[var(--color-panel)] px-6 text-center">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                  No coins added yet
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
                  Start by adding a coin slug on the left to build your personal
                  crypto watchlist.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {coins.map((item) => (
                  <article
                    key={item.id}
                    className="group rounded-[24px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                          Coin
                        </p>
                        <h3 className="mt-3 text-xl font-semibold capitalize text-[var(--color-text)]">
                          {item.coin}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCoin(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === item.id ? "Removing..." : "Delete"}
                      </button>
                    </div>

                    <div className="mt-8 rounded-2xl bg-[var(--color-panel)] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        Price (USD)
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-[var(--color-text)]">
                        ${Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
