import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdmin } from "@/lib/admin-auth";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/validation";
import { Dashboard } from "./Dashboard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Orders admin",
  robots: { index: false, follow: false },
};

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <main className="min-h-screen bg-ivory">
      <Suspense fallback={<AdminLoading />}>
        <AdminGate searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function AdminGate({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const admin = await getAdmin();
  if (!admin) return <LoginForm />;
  const { status } = await searchParams;
  const filter: OrderStatus | "all" =
    typeof status === "string" && (ORDER_STATUSES as readonly string[]).includes(status)
      ? (status as OrderStatus)
      : "all";
  return <Dashboard filter={filter} adminEmail={admin.email} />;
}

function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-champagne border-t-maroon" aria-label="Loading" />
    </div>
  );
}
