import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type TicketStatus = "open" | "closed";

export type Ticket = {
  id: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  support_type: string;
  status: TicketStatus;
  createdAt: string;
};

type Row = {
  id: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  support_type: string;
  status: TicketStatus;
  created_at: string;
};

function rowToTicket(row: Row): Ticket {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    description: row.description,
    support_type: row.support_type,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[]).map(rowToTicket);
}

export async function getOpenTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[]).map(rowToTicket);
}

export async function getClosedTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("status", "closed")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[]).map(rowToTicket);
}

export async function setTicketStatus(
  id: string,
  status: TicketStatus,
): Promise<void> {
  const { error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

async function notifySlackNewTicket(ticket: Ticket): Promise<void> {
  const urls = [
    process.env.SLACK_WEBHOOK_URL_1,
    process.env.SLACK_WEBHOOK_URL_2,
  ].filter(Boolean) as string[];

  const body = {
    text: `New support ticket from ${ticket.name}: "${ticket.subject}"`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🎫 New Support Ticket*\n*From:* ${ticket.name} (${ticket.email})\n*Type:* ${ticket.support_type}\n*Subject:* ${ticket.subject}\n*Message:* ${ticket.description}`,
        },
      },
      {
        type: "actions",
        block_id: `ticket_actions_${ticket.id}`,
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "✅ Close Ticket" },
            style: "primary",
            action_id: "close_ticket",
            value: ticket.id,
            confirm: {
              title: { type: "plain_text", text: "Close this ticket?" },
              text: { type: "plain_text", text: "This will mark the ticket as closed in the dashboard." },
              confirm: { type: "plain_text", text: "Yes, close it" },
              deny: { type: "plain_text", text: "Cancel" },
            },
          },
        ],
      },
    ],
  };

  await Promise.all(
    urls.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    ),
  );
}

export async function notifySlackMorningBrief(tickets: Ticket[]): Promise<void> {
  const urls = [
    process.env.SLACK_WEBHOOK_URL_1,
    process.env.SLACK_WEBHOOK_URL_2,
  ].filter(Boolean) as string[];

  const lines = tickets.map(
    (t) => `• *${t.subject}* — ${t.name} (${t.support_type}) — <${process.env.NEXT_PUBLIC_SUPABASE_URL ? `https://support.crushingdoubt.com/dashboard` : "#"}|View>`,
  );

  const body = {
    text: `Good morning! ${tickets.length} open ticket${tickets.length === 1 ? "" : "s"} to review.`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "☀️ Morning Support Briefing" },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: tickets.length === 0
            ? "No open tickets. Great work! 🎉"
            : `*${tickets.length} open ticket${tickets.length === 1 ? "" : "s"}:*\n${lines.join("\n")}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open Dashboard" },
            url: "https://support.crushingdoubt.com/dashboard",
            action_id: "open_dashboard",
          },
        ],
      },
    ],
  };

  await Promise.all(
    urls.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    ),
  );
}

export async function submitTicket(input: {
  name: string;
  email: string;
  subject: string;
  description: string;
  support_type: string;
}): Promise<Ticket> {
  const { data, error } = await supabase
    .from("tickets")
    .insert([{ ...input, status: "open" }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  const ticket = rowToTicket(data as Row);
  await notifySlackNewTicket(ticket);
  return ticket;
}
