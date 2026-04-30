import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { bdt, toBn } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type ProductForm = {
  id?: string; slug: string; name: string; description: string;
  price: string; original_price: string; image_url: string; weight: string;
  stock: string; is_featured: boolean; is_active: boolean; sort_order: string;
};
const empty: ProductForm = { slug: "", name: "", description: "", price: "", original_price: "", image_url: "", weight: "", stock: "0", is_featured: false, is_active: true, sort_order: "0" };

function AdminProducts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ProductForm | null>(null);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      slug: editing.slug, name: editing.name, description: editing.description || null,
      price: Number(editing.price), original_price: editing.original_price ? Number(editing.original_price) : null,
      image_url: editing.image_url || null, weight: editing.weight || null,
      stock: Number(editing.stock), is_featured: editing.is_featured, is_active: editing.is_active,
      sort_order: Number(editing.sort_order),
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("সংরক্ষিত");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (id: string) => {
    if (!confirm("ডিলিট করবেন?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("মুছে ফেলা হয়েছে");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">প্রোডাক্ট</h1>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> নতুন
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr><th className="p-3">নাম</th><th className="p-3">দাম</th><th className="p-3">স্টক</th><th className="p-3">স্ট্যাটাস</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{bdt(Number(p.price))}</td>
                <td className="p-3">{toBn(p.stock)}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{p.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}</span></td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing({ id: p.id, slug: p.slug, name: p.name, description: p.description ?? "", price: String(p.price), original_price: p.original_price ? String(p.original_price) : "", image_url: p.image_url ?? "", weight: p.weight ?? "", stock: String(p.stock), is_featured: p.is_featured, is_active: p.is_active, sort_order: String(p.sort_order) })} className="rounded-lg p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(p.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <form onSubmit={save} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editing.id ? "এডিট" : "নতুন"} প্রোডাক্ট</h2><button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 hover:bg-muted"><X className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="নাম *" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required />
              <Input label="Slug *" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} required />
              <Input label="দাম *" type="number" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} required />
              <Input label="মূল দাম" type="number" value={editing.original_price} onChange={(v) => setEditing({ ...editing, original_price: v })} />
              <Input label="ছবির URL" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} />
              <Input label="ওজন" value={editing.weight} onChange={(v) => setEditing({ ...editing, weight: v })} />
              <Input label="স্টক" type="number" value={editing.stock} onChange={(v) => setEditing({ ...editing, stock: v })} />
              <Input label="ক্রম" type="number" value={editing.sort_order} onChange={(v) => setEditing({ ...editing, sort_order: v })} />
            </div>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-sm font-medium">বিবরণ</span>
              <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            </label>
            <div className="mt-3 flex gap-4">
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} /> ফিচার্ড</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> সক্রিয়</label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-border px-5 py-2 text-sm font-semibold hover:bg-muted">বাতিল</button>
              <button type="submit" className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">সংরক্ষণ</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
    </label>
  );
}