"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addTicket, setTicketStatus, type TicketStatus } from "@/lib/tickets";

// --- Slack notification (mock) -------------------------------------------
// In the real build this posts to a Slack Incoming Webhook. For the demo we
// just log so you can see where it fires. Swap the body of this function for
// a fetch() to process.env.SLACK_WEBHOOK_URL when we go live.
async function notifySlack(message: string): Promise<void> {
  console.log(`[slack] ${message}`);
}

export async function createTicket(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !email || !subject || !description) {
    // Basic guard; the form also uses required HTML attributes.
    throw new Error("All fields are required.");
  }

  const ticket = addTicket({ name, email, subject, description });

  await notifySlack(
    `🎫 New support ticket ${ticket.id} from ${ticket.name}: "${ticket.subject}"`,
  );

  revalidatePath("/dashboard");
  redirect("/submit?success=1");
}

export async function updateStatus(
  id: string,
  status: TicketStatus,
): Promise<void> {
  setTicketStatus(id, status);
  revalidatePath("/dashboard");
}
