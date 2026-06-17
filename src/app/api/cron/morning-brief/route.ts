import { getOpenTickets, notifySlackMorningBrief } from "@/lib/tickets";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tickets = await getOpenTickets();
  await notifySlackMorningBrief(tickets);

  return Response.json({ ok: true, openTickets: tickets.length });
}
