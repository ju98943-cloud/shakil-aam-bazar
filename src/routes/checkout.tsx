import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cart, useCart, useCartHydrated } from "@/lib/cart";
import { bdt, toBn } from "@/lib/format";
import { toast } from "sonner";
import { Copy, Check, MapPin, Truck, Wallet } from "lucide-react";
import bkashLogo from "@/assets/bkash-logo.png";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "চেকআউট | Mangooz" }] }),
  component: CheckoutPage,
});

const BKASH_NUMBER = "01325444569";
const WEB3FORMS_KEY = "0076fad7-789a-4476-b990-7a2cdef178dd";
const KG_PER_BOX = 6;

type Zone = "dhaka" | "outside";
type DType = "point" | "home";
type PayChoice = "delivery_only" | "full";

// rate per kg: [under20, over20]
const RATES: Record<Zone, Record<DType, [number, number]>> = {
  dhaka:    { point: [13, 12], home: [22, 20] },
  outside:  { point: [18, 16], home: [26, 24] },
};
// minimums
const MIN_DHAKA = { point: 100, home: 120 };
const MIN_OUTSIDE = { point: 120, home: 130 };

function calcShipping(zone: Zone, dtype: DType, weightKg: number): number {
  if (weightKg <= 0) return 0;
  const [under, over] = RATES[zone][dtype];
  const rate = weightKg > 20 ? over : under;
  let cost = Math.round(weightKg * rate);
  const min = zone === "dhaka" ? MIN_DHAKA[dtype] : MIN_OUTSIDE[dtype];
  if (cost < min) cost = min;
  return cost;
}

function CheckoutPage() {
  const items = useCart();
  const hydrated = useCartHydrated();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", district: "", notes: "", trxid: "" });
  const [zone, setZone] = useState<Zone | "">("");
  const [dtype, setDtype] = useState<DType | "">("");
  const [pay, setPay] = useState<PayChoice>("delivery_only");
  const [copied, setCopied] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const weightKg = totalQty * KG_PER_BOX;

  const deliveryReady = zone !== "" && dtype !== "";
  const shipping = deliveryReady ? calcShipping(zone as Zone, dtype as DType, weightKg) : 0;
  const total = subtotal + shipping;
  const payNow = pay === "full" ? total : shipping; // delivery-only = pay shipping advance
  const remaining = Math.max(0, total - payNow);

  const trxFilled = form.trxid.trim().length >= 6;
  const canOrder = deliveryReady && trxFilled && form.name && form.phone && form.address && form.district;

  if (hydrated && items.length === 0) {
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">কার্ট খালি</h1></div>;
  }

  const copyText = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500); }
    catch { toast.error("কপি করা যায়নি"); }
  };

  const zoneLabel = (z: Zone) =>
    z === "dhaka" ? "ঢাকার ভেতর" : "ঢাকার বাহিরে";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canOrder) { toast.error("সকল তথ্য পূরণ করুন"); return; }
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
      fd.append("weight_kg", `${weightKg} KG`);
      fd.append("delivery_zone", zoneLabel(zone as Zone));
      fd.append("delivery_type", dtype === "point" ? "Point Delivery" : "Home Delivery");
      fd.append("subtotal", `৳${subtotal}`);
      fd.append("shipping", `৳${shipping}`);
      fd.append("total", `৳${total}`);
      fd.append("payment_choice", pay === "full" ? "Full Amount via bKash" : "Delivery Charge Only via bKash");
      fd.append("paid_now_bkash", `৳${payNow}`);
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
        <div className="space-y-6">
          {/* STEP 1: Delivery info */}
          <Section step={1} title="ডেলিভারি তথ্য">
            <div className="space-y-5">
              <Field label="পূর্ণ নাম *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="মোবাইল নম্বর *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
              <Field label="সম্পূর্ণ ঠিকানা *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} multiline />
              <Field label="জেলা / উপজেলা *" value={form.district} onChange={(v) => setForm({ ...form, district: v })} placeholder="যেমন: ঢাকা, রাজশাহী" />
              <Field label="অতিরিক্ত নোট (ঐচ্ছিক)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} multiline />
            </div>
          </Section>

          {/* STEP 2: Delivery option */}
          <Section step={2} title="ডেলিভারি অপশন">
            <div className="mb-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">এলাকা নির্বাচন করুন</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["dhaka", "outside"] as Zone[]).map((z) => (
                  <button key={z} type="button" onClick={() => setZone(z)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${zone === z ? "border-primary bg-primary/5 font-bold" : "border-border hover:border-primary/40"}`}>
                    <MapPin className="mb-1 inline h-3.5 w-3.5" /> {zoneLabel(z)}
                  </button>
                ))}
              </div>
            </div>

            {zone && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ডেলিভারি ধরন (মোট ওজন: {toBn(weightKg)} কেজি)</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(["point", "home"] as DType[]).map((t) => {
                    const cost = calcShipping(zone as Zone, t, weightKg);
                    return (
                      <button key={t} type="button" onClick={() => setDtype(t)}
                        className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition ${dtype === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-sm"><Truck className="h-3.5 w-3.5" /> {t === "point" ? "Point Delivery" : "Home Delivery"}</div>
                          <div className="text-xs text-muted-foreground">Chargeable weight: {toBn(weightKg)} KG</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{bdt(cost)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {!deliveryReady && <p className="mt-3 text-xs text-amber-600">⚠ ডেলিভারি অপশন নির্বাচন করুন</p>}
          </Section>

          {/* STEP 3: Payment Method */}
          <Section step={3} title="Payment Method" disabled={!deliveryReady}>
            {!deliveryReady ? (
              <p className="text-sm text-muted-foreground">আগে ডেলিভারি অপশন নির্বাচন করুন।</p>
            ) : (
              <>
                <div className="grid w-full max-w-[200px] gap-2">
                  <div className="flex items-center gap-3 rounded-xl border-2 border-pink-500 bg-pink-50 px-4 py-2.5 text-pink-700 dark:bg-pink-950/30">
                    <img src={bkashLogo} alt="bKash" className="h-10 w-10 rounded-md object-contain" />
                    <span className="font-bold text-sm">bKash</span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border-2 border-pink-200 bg-pink-50/50 p-4 dark:border-pink-900/40 dark:bg-pink-950/10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-pink-600">bKash</span>
                    <span className="text-sm font-mono text-foreground/70">{BKASH_NUMBER}</span>
                  </div>
                  <div className="mt-3 mb-2 text-sm font-semibold text-foreground">How much to pay now?</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPay("delivery_only")}
                      className={`rounded-xl px-3 py-3 text-center transition ${pay === "delivery_only" ? "bg-pink-600 text-white" : "border-2 border-border bg-card text-foreground"}`}>
                      <div className="text-xs font-semibold opacity-90">Delivery Charge Only</div>
                      <div className="mt-0.5 font-bold">{bdt(shipping)}</div>
                    </button>
                    <button type="button" onClick={() => setPay("full")}
                      className={`rounded-xl px-3 py-3 text-center transition ${pay === "full" ? "bg-pink-600 text-white" : "border-2 border-border bg-card text-foreground"}`}>
                      <div className="text-xs font-semibold opacity-90">Full Amount</div>
                      <div className="mt-0.5 font-bold">{bdt(total)}</div>
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl border border-pink-300/60 bg-card p-4">
                    <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
                      <Wallet className="h-4 w-4" /> Payment Instructions
                    </div>
                    <p className="mt-1.5 text-xs text-foreground/75">
                      Send <span className="font-bold">{bdt(payNow)}</span> to the bKash number below, then enter your Transaction ID (TrxID).
                    </p>
                    <div className="mt-3 space-y-2">
                      <CopyRow label="Send to" value={BKASH_NUMBER} copied={copied === "num"} onCopy={() => copyText(BKASH_NUMBER, "num")} />
                      <CopyRow label="Amount" value={`৳${toBn(payNow)}`} copied={copied === "amt"} onCopy={() => copyText(String(payNow), "amt")} />
                    </div>
                    <label className="mt-4 block">
                      <span className="mb-1.5 block text-sm font-semibold text-pink-600">Transaction ID / TrxID *</span>
                      <input type="text" value={form.trxid}
                        onChange={(e) => setForm({ ...form, trxid: e.target.value.toUpperCase() })}
                        placeholder="ENTER YOUR BKASH TRANSACTION ID"
                        className="w-full rounded-xl border-2 border-pink-200 bg-background px-4 py-2.5 text-sm font-mono tracking-wider focus:border-pink-500 focus:outline-none" />
                      <span className="mt-1 block text-[11px] text-muted-foreground">e.g. 8N7A5BC2DE</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </Section>
        </div>

        {/* SUMMARY */}
        <div className="h-fit rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 text-lg font-bold">আপনার অর্ডার</h2>
          <div className="space-y-2 text-sm">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between gap-2"><span className="text-foreground/80">{it.name} × {it.quantity}</span><span className="font-semibold">{bdt(it.price * it.quantity)}</span></div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">সাবটোটাল</span><span>{bdt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">শিপিং ({toBn(weightKg)} কেজি)</span><span>{deliveryReady ? bdt(shipping) : "—"}</span></div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="font-bold">মোট</span><span className="text-2xl font-bold text-primary">{deliveryReady ? bdt(total) : "—"}</span>
          </div>
          {deliveryReady && (
            <div className="mt-3 space-y-1 rounded-xl bg-pink-50 p-3 text-xs dark:bg-pink-950/20">
              <div className="flex justify-between"><span className="text-muted-foreground">এখন bKash এ</span><span className="font-bold text-pink-600">{bdt(payNow)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ডেলিভারিতে দেয়</span><span className="font-semibold">{bdt(remaining)}</span></div>
            </div>
          )}
          <button type="submit" disabled={!canOrder || submitting}
            className="mt-5 w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? "প্রসেস হচ্ছে..." : !deliveryReady ? "ডেলিভারি অপশন নির্বাচন করুন" : !trxFilled ? "TrxID দিন" : "অর্ডার নিশ্চিত করুন"}
          </button>
          {!canOrder && <p className="mt-2 text-center text-[11px] text-muted-foreground">সকল ধাপ পূরণ করার পর বাটন সক্রিয় হবে</p>}
        </div>
      </form>
    </div>
  );
}

function Section({ step, title, children, disabled }: { step: number; title: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] ${disabled ? "opacity-70" : ""}`}>
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{step}</span>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function CopyRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-4 py-2.5">
      <div className="min-w-0 text-sm">
        <span className="text-muted-foreground">{label}: </span>
        <span className="font-mono font-bold text-foreground">{value}</span>
      </div>
      <button type="button" onClick={onCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-pink-300 bg-card px-3 py-1.5 text-xs font-semibold text-pink-600 hover:bg-pink-50">
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
