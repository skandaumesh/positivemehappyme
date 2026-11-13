import { isAdmin } from "@/lib/admin-auth";
import { listActiveOrders } from "@/lib/orders";
import { orderCode } from "@/lib/site";

/** CSV of all (non-deleted) orders for shipping labels / accounts. Opens in Excel or Google Sheets. */
export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  let data;
  try {
    ({ orders: data } = await listActiveOrders({ ascending: true, limit: 10000 }));
  } catch (e) {
    return new Response(e instanceof Error ? e.message : "Could not load orders", { status: 500 });
  }

  const cell = (v: unknown) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = ["Order", "Date (IST)", "Status", "Name", "Phone", "Email", "Kids", "Adults", "Total (INR)", "Google Maps", "Address"];
  const rows = data.map((o) => [
    orderCode(o.order_no),
    new Date(o.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    o.status,
    o.name,
    `${o.phone.slice(0, 5)} ${o.phone.slice(5)}`,
    o.email,
    o.kids_qty,
    o.adults_qty,
    o.total,
    o.map_link,
    o.address ?? "",
  ]);
  const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pmhm-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
