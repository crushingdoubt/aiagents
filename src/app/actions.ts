"use server";

import { revalidatePath } from "next/cache";
import { submitTicket, setTicketStatus, uploadScreenshot, type TicketStatus } from "@/lib/tickets";

export async function createTicket(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const support_type = String(formData.get("support_type") ?? "").trim();

  if (!name || !email || !subject || !description || !support_type) {
    throw new Error("All fields are required.");
  }

  let screenshot_url: string | null = null;
  const file = formData.get("screenshot");
  if (file instanceof File && file.size > 0) {
    const bytes = await file.arrayBuffer();
    screenshot_url = await uploadScreenshot(
      Buffer.from(bytes),
      file.name,
      file.type || "image/png",
    );
  }

  await submitTicket({ name, email, subject, description, support_type, screenshot_url });
  revalidatePath("/dashboard");
}

export async function updateStatus(
  id: string,
  status: TicketStatus,
): Promise<void> {
  await setTicketStatus(id, status);
  revalidatePath("/dashboard");
}
