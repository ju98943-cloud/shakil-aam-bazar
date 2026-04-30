import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { bdt, toBn } from "@/lib/format";
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDash,
});

function AdminDash() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [orders, products] = await Promise.all([
        supabase.from("orders").select("id,total,status"),
        supabase.from("products").select("id"),
      ]);
      const list = orders.data ?? [];
      return {
        orderCount: list.length,
        revenue: list.reduce((s, o) => s + Number(o.total), 0),
        pending: list.filter((o) => o.status === "pending").length,
        productCount: products.data?.length ?? 0,
      };
    },
  });

  const stats = [
    { icon: ShoppingCart, label: "মোট অর্ডার", value: toBn(data?.orderCount ?? 0) },
    { icon: Clock, label: "পেন্ডিং অর্ডার", value: toBn(data?.pending ?? 0) },
    { icon: DollarSign, label: "মোট আয়", value: bdt(data?.revenue ?? 0) },
    { icon: Package, label: "প্রোডাক্ট", value: toBn(data?.productCount ?? 0) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">ড্যাশবোর্ড</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
            <div className="mt-3 text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}