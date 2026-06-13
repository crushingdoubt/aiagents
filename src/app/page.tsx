import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-zinc-50 px-6 py-24 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Crushing Doubt
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Support Desk
        </h1>
        <p className="mx-auto max-w-md text-lg text-zinc-600">
          A simple place to file support tickets and track what&apos;s open vs.
          closed.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/submit"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          Submit a ticket
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-100"
        >
          Team dashboard
        </Link>
        <Link
          href="/embed"
          className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-100"
        >
          Embed widget
        </Link>
      </div>

      <p className="text-xs text-zinc-400">
        Prototype — tickets are stored in memory and reset on restart.
      </p>
    </main>
  );
}
