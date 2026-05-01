import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Truck, Leaf, ShieldCheck, Phone } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import heroImg from "@/assets/hero-mangoes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shakil AAM Bazar — খাঁটি রাজশাহীর আম ঘরে বসে অর্ডার করুন" },
      { name: "description", content: "ফরমালিন মুক্ত হিমসাগর, ল্যাংড়া, আম্রপালি, ফজলি আম। সারা বাংলাদেশে হোম ডেলিভারি, ক্যাশ অন ডেলিভারি।" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-warm)" }} />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Leaf className="h-3.5 w-3.5" /> ১০০% ফরমালিন মুক্ত
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground md:text-6xl">
              খাঁটি <span className="text-accent">রাজশাহীর আম</span><br />
              সরাসরি বাগান থেকে
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              প্রকৃতির স্বাদ যেমনটা হওয়া উচিত — মিষ্টি, রসালো এবং নিরাপদ। আমাদের নিজস্ব বাগান থেকে আপনার ঘরে পৌঁছে যাবে সেরা মানের আম।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-elevated)]">
                এখনই অর্ডার করুন
              </Link>
              <a href="tel:01700000000" className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-card px-7 py-3.5 text-sm font-semibold text-primary hover:bg-secondary">
                <Phone className="h-4 w-4" /> ০১৭০০-০০০০০০
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-accent/20 blur-3xl" />
            <img src={heroImg} alt="Fresh Bangladeshi mangoes" width={1600} height={1100}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[var(--shadow-elevated)]" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Leaf, t: "ফরমালিন মুক্ত", d: "সম্পূর্ণ প্রাকৃতিক ও কেমিক্যাল মুক্ত আম" },
            { icon: Truck, t: "দ্রুত ডেলিভারি", d: "সারা বাংলাদেশে ৪৮ ঘন্টায় হোম ডেলিভারি" },
            { icon: ShieldCheck, t: "ক্যাশ অন ডেলিভারি", d: "পণ্য হাতে পেয়ে টাকা পরিশোধ করুন" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">আমাদের আম</span>
            <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">জনপ্রিয় জাতসমূহ</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-primary hover:underline md:inline">সব দেখুন →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground md:px-16">
          <h2 className="text-3xl font-bold md:text-4xl">এই মৌসুমে স্বাদ নিন প্রকৃত আমের</h2>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">আমাদের আম একবার চেখে দেখুন — আপনি পার্থক্য বুঝতে পারবেন।</p>
          <Link to="/shop" className="mt-7 inline-flex rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-foreground hover:opacity-90">
            অর্ডার করুন
          </Link>
        </div>
      </section>
    </div>
  );
}
