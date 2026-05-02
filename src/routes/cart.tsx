import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { cart, useCart, useCartHydrated } from "@/lib/cart";
import { bdt, toBn } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "কার্ট | Mangooz" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart();
  const hydrated = useCartHydrated();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!hydrated) return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">লোড হচ্ছে...</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-6 text-2xl font-bold">আপনার কার্ট খালি</h1>
        <p className="mt-2 text-muted-foreground">পছন্দের আম যোগ করুন এবং অর্ডার সম্পন্ন করুন।</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">শপিং শুরু করুন</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">আপনার কার্ট</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                {it.image_url && <img src={it.image_url} alt={it.name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-foreground">{it.name}</h3>
                    {it.weight && <p className="text-xs text-muted-foreground">{it.weight}</p>}
                  </div>
                  <button onClick={() => cart.remove(it.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-border">
                    <button onClick={() => cart.setQty(it.id, it.quantity - 1)} className="p-2 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="w-10 text-center text-sm font-bold">{toBn(it.quantity)}</span>
                    <button onClick={() => cart.setQty(it.id, it.quantity + 1)} className="p-2 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="font-bold text-primary">{bdt(it.price * it.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-bold">অর্ডার সারাংশ</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">সাবটোটাল</span><span className="font-semibold">{bdt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">শিপিং</span><span className="text-xs text-muted-foreground">চেকআউটে গণনা</span></div>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-bold">মোট</span>
            <span className="text-2xl font-bold text-primary">{bdt(subtotal)}</span>
          </div>
          <Link to="/checkout" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground hover:bg-primary/90">
            চেকআউট করুন
          </Link>
        </div>
      </div>
    </div>
  );
}