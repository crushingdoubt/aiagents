"use client";

import { useTransition } from "react";
import { updateStatus } from "@/app/actions";
import type { TicketStatus } from "@/lib/tickets";

export function StatusButton({
  id,
  status,
}: {
  id: string;
  status: TicketStatus;
}) {
  const [pending, startTransition] = useTransition();
  const next: TicketStatus = status === "open" ? "closed" : "open";
  const label = status === "open" ? "Close ticket" : "Reopen";

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await updateStatus(id, next);
        })
      }
      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}
