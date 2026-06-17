import { setTicketStatus } from "@/lib/tickets";
import { revalidatePath } from "next/cache";
import { createHmac, timingSafeEqual } from "crypto";

async function verifySlackSignature(request: Request, body: string): Promise<boolean> {
  const timestamp = request.headers.get("x-slack-request-timestamp");
  const signature = request.headers.get("x-slack-signature");

  if (!timestamp || !signature) return false;

  // Reject requests older than 5 minutes to prevent replay attacks.
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const secrets = [
    process.env.SLACK_SIGNING_SECRET_1,
    process.env.SLACK_SIGNING_SECRET_2,
  ].filter(Boolean) as string[];

  const baseString = `v0:${timestamp}:${body}`;

  for (const secret of secrets) {
    const expected = "v0=" + createHmac("sha256", secret).update(baseString).digest("hex");
    try {
      if (timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
        return true;
      }
    } catch {
      // length mismatch — not a match
    }
  }

  return false;
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  const valid = await verifySlackSignature(request, rawBody);
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }

  const params = new URLSearchParams(rawBody);
  const payload = JSON.parse(params.get("payload") ?? "{}");

  const action = payload?.actions?.[0];
  if (action?.action_id === "close_ticket") {
    const ticketId = action.value as string;
    await setTicketStatus(ticketId, "closed");
    revalidatePath("/dashboard");

    // Update the Slack message to show it's been closed.
    const responseUrl = payload.response_url as string;
    if (responseUrl) {
      await fetch(responseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replace_original: true,
          text: payload.message?.text ?? "Support ticket",
          blocks: [
            ...(payload.message?.blocks?.slice(0, 1) ?? []),
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `✅ Closed by ${payload.user?.name ?? "team member"} via Slack`,
                },
              ],
            },
          ],
        }),
      });
    }
  }

  return new Response("", { status: 200 });
}
