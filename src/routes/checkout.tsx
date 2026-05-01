import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cart, useCart, useCartHydrated } from "@/lib/cart";
import { bdt } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "চেকআউট | Shakil AAM Bazar" }] }),
  component: CheckoutPage,
});

const SHIPPING_INSIDE_DHAKA = 80;
const SHIPPING_OUTSIDE = 150;

function CheckoutPage() {
  const items = useCart();
  const hydrated = useCartHydrated();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", district: "", notes: "" });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = form.district.toLowerCase().includes("dhaka") || form.district.includes("ঢাকা") ? SHIPPING_INSIDE_DHAKA : SHIPPING_OUTSIDE;
  const total = subtotal + (items.length > 0 ? shipping : 0);

  if (hydrated && items.length === 0) {
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">কার্ট খালি</h1></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.district) {
      toast.error("সকল তথ্য পূরণ করুন"); return;
    }
    setSubmitting(true);
    try {
      const orderDetails = items.map((it) => `${it.name} × ${it.quantity} = ৳${it.price * it.quantity}`).join("\n");
      const body = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        district: form.district,
        notes: form.notes || "N/A",
        order_items: orderDetails,
        subtotal: `৳${subtotal}`,
        shipping: `৳${shipping}`,
        total: `৳${total}`,
      };

      const res = await fetch("https://formspree.io/f/movdjjkj", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("ফর্ম জমা দিতে ব্যর্থ");

      cart.clear();
      toast.success("অর্ডার সফলভাবে গ্রহণ করা হয়েছে!");
      navigate({ to: "/order-success", search: { o: undefined } });
    } catch (err: any) {
      toast.error("অর্ডার দিতে ব্যর্থ: " + (err.message || "অজানা সমস্যা"));
    } finally { setSubmitting(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">চেকআউট</h1>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-bold">ডেলিভারি তথ্য</h2>
          <Field label="পূর্ণ নাম *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="মোবাইল নম্বর *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
          <Field label="সম্পূর্ণ ঠিকানা *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} multiline />
          <Field label="জেলা *" value={form.district} onChange={(v) => setForm({ ...form, district: v })} placeholder="যেমন: ঢাকা, রাজশাহী, চট্টগ্রাম" />
          <Field label="অতিরিক্ত নোট (ঐচ্ছিক)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} multiline />

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="font-semibold text-primary">পেমেন্ট পদ্ধতি</div>
            <div className="mt-1 text-sm text-foreground/70">ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।</div>
          </div>
        </div>
        <div className="h-fit rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 text-lg font-bold">আপনার অর্ডার</h2>
          <div className="space-y-2 text-sm">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between gap-2"><span className="text-foreground/80">{it.name} × {it.quantity}</span><span className="font-semibold">{bdt(it.price * it.quantity)}</span></div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">সাবটোটাল</span><span>{bdt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">শিপিং</span><span>{bdt(shipping)}</span></div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="font-bold">মোট</span><span className="text-2xl font-bold text-primary">{bdt(total)}</span>
          </div>
          <button type="submit" disabled={submitting} className="mt-5 w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {submitting ? "প্রসেস হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground/80">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
      )}
    </label>
  );
}