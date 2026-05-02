import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cart, useCart, useCartHydrated } from "@/lib/cart";
import { bdt, toBn } from "@/lib/format";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "চেকআউট | Mangooz" }] }),
  component: CheckoutPage,
});

const SHIPPING_INSIDE_DHAKA = 80;
const SHIPPING_OUTSIDE = 150;
const BKASH_NUMBER = "01325444569";
const WEB3FORMS_KEY = "0076fad7-789a-4476-b990-7a2cdef178dd";

function CheckoutPage() {
  const items = useCart();
  const hydrated = useCartHydrated();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", district: "", notes: "", trxid: "" });
  const [copied, setCopied] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = form.district.toLowerCase().includes("dhaka") || form.district.includes("ঢাকা") ? SHIPPING_INSIDE_DHAKA : SHIPPING_OUTSIDE;
  const total = subtotal + (items.length > 0 ? shipping : 0);
  const advance = Math.max(500, Math.round(total * 0.20));
  const remaining = Math.max(0, total - advance);

  if (hydrated && items.length === 0) {
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">কার্ট খালি</h1></div>;
  }

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("কপি করা যায়নি");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.district) {
      toast.error("সকল তথ্য পূরণ করুন"); return;
    }
    if (!form.trxid.trim()) {
      toast.error("bKash Transaction ID দিন"); return;
    }
    setSubmitting(true);
    try {
      const orderDetails = items.map((it) => `${it.name} × ${it.quantity} = ৳${it.price * it.quantity}`).join("\n");
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_KEY);
      fd.append("subject", "নতুন অর্ডার - Mangooz");
      fd.append("from_name", "Mangooz Order");
      fd.append("name", form.name);
      fd.append("phone", form.phone);
      fd.append("address", form.address);
      fd.append("district", form.district);
      fd.append("notes", form.notes || "N/A");
      fd.append("order_items", orderDetails);
      fd.append("subtotal", `৳${subtotal}`);
      fd.append("shipping", `৳${shipping}`);
      fd.append("total", `৳${total}`);
      fd.append("advance_paid_bkash", `৳${advance}`);
      fd.append("remaining_cod", `৳${remaining}`);
      fd.append("bkash_number", BKASH_NUMBER);
      fd.append("bkash_trxid", form.trxid.trim());

      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "ফর্ম জমা দিতে ব্যর্থ");

      cart.clear();
      toast.success("অর্ডার সফলভাবে গ্রহণ করা হয়েছে!");
      navigate({ to: "/order-success" });
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

          {/* PAYMENT INSTRUCTIONS */}
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 items-center justify-center rounded-md bg-pink-600 px-2 text-xs font-bold text-white">bKash</span>
              <div className="font-bold text-foreground">পেমেন্ট নির্দেশনা</div>
            </div>
            <p className="mt-2 text-sm text-foreground/75">
              অর্ডার নিশ্চিত করতে নিচের bKash নম্বরে <span className="font-bold text-primary">{bdt(advance)}</span> অগ্রিম পাঠান (২০% বা সর্বনিম্ন ৳৫০০), তারপর Transaction ID (TrxID) দিন। বাকি <span className="font-semibold">{bdt(remaining)}</span> ডেলিভারির সময় পরিশোধ করবেন।
            </p>

            <div className="mt-4 space-y-2">
              <CopyRow label="Send to" value={BKASH_NUMBER} copied={copied === "num"} onCopy={() => copyText(BKASH_NUMBER, "num")} />
              <CopyRow label="Amount" value={`৳${toBn(advance)}`} copied={copied === "amt"} onCopy={() => copyText(String(advance), "amt")} />
            </div>

            <div className="mt-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">Transaction ID / TrxID *</span>
                <input
                  type="text"
                  value={form.trxid}
                  onChange={(e) => setForm({ ...form, trxid: e.target.value })}
                  placeholder="যেমন: 9A7B2C4D1E"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none uppercase tracking-wider"
                />
              </label>
            </div>
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
          <div className="mt-3 space-y-1 rounded-xl bg-secondary/60 p-3 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">অগ্রিম (bKash)</span><span className="font-bold text-primary">{bdt(advance)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">ডেলিভারিতে দেয়</span><span className="font-semibold">{bdt(remaining)}</span></div>
          </div>
          <button type="submit" disabled={submitting} className="mt-5 w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {submitting ? "প্রসেস হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CopyRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-2.5">
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate font-mono text-base font-bold text-foreground">{value}</div>
      </div>
      <button type="button" onClick={onCopy}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
        {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
      </button>
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