import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { useAdminAuth } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, isAdmin, userId } = useAdminAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!loading && !userId) navigate({ to: "/admin/login" });
  }, [loading, userId, navigate]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">লোড হচ্ছে...</div>;
  if (!userId) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">অ্যাক্সেস নেই</h1>
        <p className="mt-3 text-muted-foreground">আপনার অ্যাকাউন্টে অ্যাডমিন রোল নেই।</p>
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-card p-4 text-left text-sm">
          <p className="font-semibold">অ্যাডমিন হতে:</p>
          <p className="mt-2 text-muted-foreground">আপনার ব্যবহারকারী আইডি দিয়ে backend-এ user_roles টেবিলে একটি row যোগ করুন:</p>
          <code className="mt-2 block break-all rounded bg-muted px-2 py-1 text-xs">user_id: {userId}<br />role: admin</code>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
          className="mt-6 inline-flex rounded-xl border border-border px-5 py-2 text-sm font-semibold hover:bg-muted">
          লগ আউট
        </button>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { to: "/admin/products", label: "প্রোডাক্ট", icon: Package },
    { to: "/admin/orders", label: "অর্ডার", icon: ShoppingCart },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr] md:px-8">
      <aside className="h-fit rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="px-2 pb-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Admin Panel</div>
        </div>
        <nav className="space-y-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${path === n.to ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"}`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
          className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4" /> লগ আউট
        </button>
      </aside>
      <div><Outlet /></div>
    </div>
  );
}