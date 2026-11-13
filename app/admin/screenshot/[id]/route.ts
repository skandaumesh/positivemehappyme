import { isAdmin } from "@/lib/admin-auth";
import { orderCode } from "@/lib/site";
import { SCREENSHOT_BUCKET, supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Streams a payment screenshot through our own domain, so the admin page never
 * exposes Supabase storage URLs. Admin-only. `?download=1` saves it as a file.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });

  const supabase = supabaseAdmin();
  const { data: order } = await supabase
    .from("orders")
    .select("order_no, screenshot_path")
    .eq("id", id)
    .maybeSingle();
  if (!order) return new Response("Not found", { status: 404 });

  const { data: file, error } = await supabase.storage.from(SCREENSHOT_BUCKET).download(order.screenshot_path);
  if (error || !file) return new Response("Not found", { status: 404 });

  const ext = order.screenshot_path.split(".").pop() ?? "jpg";
  const download = new URL(request.url).searchParams.has("download");
  const filename = `${orderCode(order.order_no)}-payment.${ext}`;

  return new Response(file, {
    headers: {
      "Content-Type": file.type || "image/jpeg",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
