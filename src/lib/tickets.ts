// Mock ticket store for the demo build (no database yet). Backed by a local
// JSON file so all Next.js dev workers share the same data and it survives
// restarts. When we wire up Supabase, this file is the single place that changes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

// JSON file is the shared source of truth across all dev workers.
const DATA_DIR = join(process.cwd(), ".data");
const DATA_FILE = join(DATA_DIR, "tickets.json");

function readAll(): Ticket[] {
  try {
    if (!existsSync(DATA_FILE)) {
      // First run — seed the file so the dashboard looks real.
      mkdirSync(DATA_DIR, { recursive: true });
      writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
      return [...seed];
    }
    return JSON.parse(readFileSync(DATA_FILE, "utf8")) as Ticket[];
  } catch {
    return [...seed];
  }
}

function writeAll(tickets: Ticket[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2));
}

function nextId(tickets: Ticket[]): string {
  const max = tickets.reduce((m, t) => {
    const n = parseInt(t.id.replace(/^CD-/, ""), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 1000);
  return `CD-${max + 1}`;
}

export function getTickets(): Ticket[] {
  // Newest first.
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
  const tickets = readAll();
  const ticket: Ticket = {
    id: nextId(tickets),
    name: input.name,
    email: input.email,
    subject: input.subject,
    description: input.description,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  writeAll(tickets);
  return ticket;
}

export function setTicketStatus(id: string, status: TicketStatus): void {
  const tickets = readAll();
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.status = status;
    writeAll(tickets);
  }
}

// --- Slack notification (mock) -------------------------------------------
// In the real build this posts to a Slack Incoming Webhook. For the demo we
// just log so you can see where it fires. Swap the body for a fetch() to
// process.env.SLACK_WEBHOOK_URL when we go live.
async function notifySlack(message: string): Promise<void> {
  console.log(`[slack] ${message}`);
}

// Shared create-path used by both the on-site form (server action) and the
// embeddable widget (API route), so the Slack notification fires the same way.
export async function submitTicket(input: {
  name: string;
  email: string;
  subject: string;
  description: string;
}): Promise<Ticket> {
  const ticket = addTicket(input);
  await notifySlack(
    `🎫 New support ticket ${ticket.id} from ${ticket.name}: "${ticket.subject}"`,
  );
  return ticket;
}
