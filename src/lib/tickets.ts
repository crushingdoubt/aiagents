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
  status: TicketStatus;
  createdAt: string;
};

type Row = {
  id: string;
  name: string;
  email: string;
  subject: string;
  description: string;
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

async function notifySlack(message: string): Promise<void> {
  const urls = [
    process.env.SLACK_WEBHOOK_URL_1,
    process.env.SLACK_WEBHOOK_URL_2,
  ].filter(Boolean) as string[];

  await Promise.all(
    urls.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      }),
    ),
  );
}

export async function submitTicket(input: {
  name: string;
  email: string;
  subject: string;
  description: string;
}): Promise<Ticket> {
  const { data, error } = await supabase
    .from("tickets")
    .insert([{ ...input, status: "open" }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  const ticket = rowToTicket(data as Row);
  await notifySlack(
    `🎫 New support ticket from ${ticket.name}: "${ticket.subject}"`,
  );
  return ticket;
}
