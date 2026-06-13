// In-memory mock ticket store for the demo build (no database yet).
// Data resets when the dev server restarts — that's expected for the prototype.
// When we wire up Supabase, this file is the single place that changes.

export type TicketStatus = "open" | "closed";

export type Ticket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string; // ISO string
};

// Seed data so the dashboard looks real in a demo.
const seed: Ticket[] = [
  {
    id: "CD-1001",
    name: "Maria Alvarez",
    email: "maria@example.com",
    subject: "Can't reset my password",
    description:
      "The reset link in my email keeps saying it's expired even though I just requested it.",
    status: "open",
    createdAt: "2026-06-12T14:32:00.000Z",
  },
  {
    id: "CD-1002",
    name: "Dev Patel",
    email: "dev@example.com",
    subject: "Billing charged me twice",
    description:
      "I see two identical charges on my card for this month's subscription.",
    status: "open",
    createdAt: "2026-06-12T09:05:00.000Z",
  },
  {
    id: "CD-1003",
    name: "Sam Lin",
    email: "sam@example.com",
    subject: "Feature request: dark mode",
    description: "Would love a dark mode option for the dashboard.",
    status: "closed",
    createdAt: "2026-06-10T18:20:00.000Z",
  },
];

// Module-level array persists across requests within a single server process.
const tickets: Ticket[] = [...seed];

let counter = 1004;

export function getTickets(): Ticket[] {
  // Newest first.
  return [...tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOpenTickets(): Ticket[] {
  return getTickets().filter((t) => t.status === "open");
}

export function getClosedTickets(): Ticket[] {
  return getTickets().filter((t) => t.status === "closed");
}

export function addTicket(input: {
  name: string;
  email: string;
  subject: string;
  description: string;
}): Ticket {
  const ticket: Ticket = {
    id: `CD-${counter++}`,
    name: input.name,
    email: input.email,
    subject: input.subject,
    description: input.description,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  return ticket;
}

export function setTicketStatus(id: string, status: TicketStatus): void {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) ticket.status = status;
}
