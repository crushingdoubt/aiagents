"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { submitTicket, setTicketStatus, type TicketStatus } from "@/lib/tickets";

export async function createTicket(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !email || !subject || !description) {
    // Basic guard; the form also uses required HTML attributes.
    throw new Error("All fields are required.");
  }

  await submitTicket({ name, email, subject, description });

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
