import { submitTicket } from "@/lib/tickets";

// CORS: the widget runs on OTHER sites, so the browser sends cross-origin
// requests here. Open to all origins for the prototype; lock this down to your
// known domains before going live.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  // Preflight request from the browser.
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400, headers: corsHeaders },
    );
  }

  const { name, email, message } = (body ?? {}) as {
    name?: string;
    email?: string;
    message?: string;
  };

  const cleanName = (name ?? "").trim();
  const cleanEmail = (email ?? "").trim();
  const cleanMessage = (message ?? "").trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return Response.json(
      { error: "name, email, and message are required" },
      { status: 400, headers: corsHeaders },
    );
  }

  const ticket = await submitTicket({
    name: cleanName,
    email: cleanEmail,
    // The widget collects a single message; derive a short subject from it.
    subject:
      cleanMessage.length > 60
        ? `${cleanMessage.slice(0, 60)}…`
        : cleanMessage,
    description: cleanMessage,
  });

  return Response.json(
    { ok: true, id: ticket.id },
    { status: 201, headers: corsHeaders },
  );
}
