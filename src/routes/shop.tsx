import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "শপ — সব আম | Shakil AAM Bazar" },
      { name: "description", content: "হিমসাগর, ল্যাংড়া, আম্রপালি, ফজলি — সকল জাতের খাঁটি আম এক জায়গায়।" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">আমাদের সংগ্রহ</span>
        <h1 className="mt-2 text-4xl font-bold text-foreground md:text-5xl">সকল আম</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">রাজশাহীর সেরা বাগান থেকে নির্বাচিত প্রিমিয়াম মানের আম।</p>
      </div>
      {isLoading ? (
        <div className="text-center text-muted-foreground">লোড হচ্ছে...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}