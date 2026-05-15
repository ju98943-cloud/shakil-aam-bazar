import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, ArrowLeft, Leaf, Truck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { getProductBySlug } from "@/lib/products";
import { cart } from "@/lib/cart";
import { bdt, toBn } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const product = getProductBySlug(slug);

  if (!product) return <div className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">পণ্য পাওয়া যায়নি</h1><Link to="/shop" className="mt-4 inline-block text-primary underline">শপে ফিরে যান</Link></div>;

  const handleAdd = () => {
    if (product.preorder) {
      toast.info(`${product.name} — Pre order soon`);
      return;
    }
    cart.add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, weight: product.weight }, qty);
    toast.success(`${toBn(qty)} টি ${product.name} কার্টে যোগ হয়েছে`);
  };
  const handleBuy = () => {
    if (product.preorder) { toast.info(`${product.name} — Pre order soon`); return; }
    handleAdd();
    navigate({ to: "/checkout" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> শপে ফিরুন
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-secondary shadow-[var(--shadow-soft)]">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-muted">
              <span className="text-7xl">🥭</span>
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">ছবি শীঘ্রই</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
          {product.weight && <p className="mt-2 text-sm text-muted-foreground">প্যাকেজ: {product.weight}</p>}
          <div className="mt-5 flex items-baseline gap-3">
            {product.preorder ? (
              <span className="text-3xl font-bold text-accent">Pre order soon</span>
            ) : (
              <>
                <span className="text-4xl font-bold text-primary">{bdt(product.price)}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-muted-foreground line-through">{bdt(product.original_price)}</span>
                )}
              </>
            )}
          </div>
          <p className="mt-5 leading-relaxed text-foreground/80">{product.description}</p>

          <div className="mt-7 flex items-center gap-4">
            <span className="text-sm font-semibold">পরিমাণ:</span>
            <div className="inline-flex items-center rounded-xl border border-border bg-card">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-muted"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center font-bold">{toBn(qty)}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-muted"><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAdd} disabled={product.preorder} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-card px-6 py-3.5 font-semibold text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60">
              <ShoppingBag className="h-4 w-4" /> {product.preorder ? "Pre order soon" : "কার্টে যোগ করুন"}
            </button>
            <button onClick={handleBuy} disabled={product.preorder} className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
              {product.preorder ? "Pre order soon" : "এখনই কিনুন"}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6">
            {[
              { icon: Leaf, t: "ফরমালিন মুক্ত" },
              { icon: Truck, t: "দ্রুত ডেলিভারি" },
              { icon: ShieldCheck, t: "ক্যাশ অন ডেলিভারি" },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <f.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                <div className="text-xs text-muted-foreground">{f.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}