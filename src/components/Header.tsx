import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart, useCartHydrated } from "@/lib/cart";
import { toBn } from "@/lib/format";
import logoImg from "@/assets/logo.png";

const nav = [
  { to: "/", label: "হোম" },
  { to: "/shop", label: "শপ" },
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/contact", label: "যোগাযোগ" },
];

export function Header() {
  const items = useCart();
  const hydrated = useCartHydrated();
  const count = hydrated ? items.reduce((s, i) => s + i.quantity, 0) : 0;
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="Shakil AAM Bazar" width={40} height={40} className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <div className="text-base font-bold text-foreground">Shakil AAM Bazar</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">খাঁটি রাজশাহীর আম</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={`text-sm font-medium transition-colors ${path === n.to ? "text-primary" : "text-foreground/70 hover:text-primary"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">কার্ট</span>
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground">
                {toBn(count)}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden rounded-md p-2 hover:bg-muted" aria-label="menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}