import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { cart, type CartItem } from "@/lib/cart";
import { bdt } from "@/lib/format";
import { toast } from "sonner";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.preorder) {
      toast.info(`${product.name} — Pre order soon`);
      return;
    }
    const item: Omit<CartItem, "quantity"> = {
      id: product.id, name: product.name, price: product.price,
      image_url: product.image_url, weight: product.weight,
    };
    cart.add(item, 1);
    toast.success(`${product.name} কার্টে যোগ হয়েছে`);
  };
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Link to="/product/$slug" params={{ slug: product.slug }} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {discount > 0 && (
            <div className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
              -{discount}%
            </div>
          )}
          <img src={product.image_url} alt={product.name} loading="lazy" width={800} height={800}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
          {product.weight && <p className="mt-1 text-xs text-muted-foreground">{product.weight}</p>}
          <div className="mt-3 flex items-baseline gap-2">
            {product.preorder ? (
              <span className="text-lg font-bold text-accent">Pre order soon</span>
            ) : (
              <>
                <span className="text-xl font-bold text-primary">{bdt(product.price)}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-muted-foreground line-through">{bdt(product.original_price)}</span>
                )}
              </>
            )}
          </div>
          <button onClick={handleAdd} disabled={product.preorder}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
            <ShoppingBag className="h-4 w-4" /> {product.preorder ? "Pre order soon" : "কার্টে যোগ করুন"}
          </button>
        </div>
      </div>
    </Link>
  );
}