import { uploadScreenshot } from "@/lib/tickets";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400, headers: corsHeaders });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "No file provided" }, { status: 400, headers: corsHeaders });
  }

  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: "File too large (max 10 MB)" }, { status: 413, headers: corsHeaders });
  }

  const bytes = await file.arrayBuffer();
  const url = await uploadScreenshot(Buffer.from(bytes), file.name, file.type || "image/png");

  return Response.json({ url }, { status: 200, headers: corsHeaders });
}
