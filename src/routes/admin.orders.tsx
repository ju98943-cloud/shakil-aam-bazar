import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { bdt, toBn } from "@/lib/format";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
const STATUS_BN: Record<string, string> = { pending: "পেন্ডিং", confirmed: "নিশ্চিত", shipped: "শিপড", delivered: "ডেলিভার্ড", cancelled: "বাতিল" };
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-accent/20 text-foreground",
  confirmed: "bg-blue-500/15 text-blue-700",
  shipped: "bg-indigo-500/15 text-indigo-700",
  delivered: "bg-primary/15 text-primary",
  cancelled: "bg-destructive/15 text-destructive",
};

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const qc = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("স্ট্যাটাস আপডেট হয়েছে");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">অর্ডারসমূহ</h1>
      <div className="mt-6 space-y-3">
        {orders?.length === 0 && <div className="rounded-2xl border border-border/60 bg-card p-8 text-center text-muted-foreground">কোনো অর্ডার নেই</div>}
        {orders?.map((o: any) => (
          <div key={o.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
            <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full items-center justify-between p-5 text-left">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{o.order_number}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[o.status]}`}>{STATUS_BN[o.status]}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{o.customer_name} · {o.customer_phone} · {o.district}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">{bdt(Number(o.total))}</span>
                {open === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>
            {open === o.id && (
              <div className="border-t border-border/60 bg-muted/30 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold">ডেলিভারি ঠিকানা</h4>
                    <p className="mt-1 text-sm text-foreground/80">{o.customer_address}, {o.district}</p>
                    {o.notes && <p className="mt-2 text-xs text-muted-foreground">নোট: {o.notes}</p>}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">পণ্যসমূহ</h4>
                    <ul className="mt-1 space-y-1 text-sm">
                      {o.order_items?.map((it: any) => (
                        <li key={it.id} className="flex justify-between"><span>{it.product_name} × {toBn(it.quantity)}</span><span>{bdt(Number(it.unit_price) * it.quantity)}</span></li>
                      ))}
                    </ul>
                    <div className="mt-2 border-t border-border pt-2 text-sm">
                      <div className="flex justify-between"><span>সাবটোটাল</span><span>{bdt(Number(o.subtotal))}</span></div>
                      <div className="flex justify-between"><span>শিপিং</span><span>{bdt(Number(o.shipping_fee))}</span></div>
                      <div className="mt-1 flex justify-between font-bold"><span>মোট</span><span>{bdt(Number(o.total))}</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">স্ট্যাটাস পরিবর্তন:</span>
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(o.id, s)} disabled={o.status === s}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${o.status === s ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}>
                      {STATUS_BN[s]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}