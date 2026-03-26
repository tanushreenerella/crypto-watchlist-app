"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getStoredToken } from "../lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredToken();
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] text-sm text-[var(--color-muted)]">
      <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-accent)]" />
        Redirecting...
      </div>
    </main>
  );
}
