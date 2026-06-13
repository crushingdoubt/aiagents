import Link from "next/link";
import { getOpenTickets, getClosedTickets, type Ticket } from "@/lib/tickets";
import { StatusButton } from "./StatusButton";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const open = getOpenTickets();
  const closed = getClosedTickets();

  return (
    <main className="flex flex-1 flex-col bg-zinc-50 px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-zinc-500 transition hover:text-zinc-800"
            >
              ← Home
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Team dashboard
            </h1>
          </div>
          <div className="flex gap-3 text-sm">
            <Stat label="Open" value={open.length} accent="text-amber-600" />
            <Stat label="Closed" value={closed.length} accent="text-zinc-500" />
          </div>
        </div>

        <Section title="Open tickets" tickets={open} empty="No open tickets 🎉" />
        <Section title="Closed tickets" tickets={closed} empty="Nothing closed yet." />
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center shadow-sm">
      <div className={`text-2xl font-semibold ${accent}`}>{value}</div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>
    </div>
  );
}

function Section({
  title,
  tickets,
  empty,
}: {
  title: string;
  tickets: Ticket[];
  empty: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-semibold text-zinc-800">{title}</h2>
      {tickets.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-6 text-center text-zinc-500">
          {empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {tickets.map((t) => (
            <li
              key={t.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400">
                      {t.id}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.status === "open"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate font-medium text-zinc-900">
                    {t.subject}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">{t.description}</p>
                  <p className="mt-2 text-xs text-zinc-400">
                    {t.name} · {t.email} ·{" "}
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusButton id={t.id} status={t.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
