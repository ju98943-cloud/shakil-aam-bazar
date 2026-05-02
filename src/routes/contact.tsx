import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "যোগাযোগ | Mangooz" }] }),
  component: ContactPage,
});

function ContactPage() {
  const items = [
    { icon: Phone, t: "ফোন / কল", v: "০১৭০০-০০০০০০", href: "tel:01700000000" },
    { icon: MessageCircle, t: "হোয়াটসঅ্যাপ", v: "০১৭০০-০০০০০০", href: "https://wa.me/8801700000000" },
    { icon: Mail, t: "ইমেইল", v: "info@mangooz.com", href: "mailto:info@mangooz.com" },
    { icon: MapPin, t: "ঠিকানা", v: "রাজশাহী, বাংলাদেশ" },
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">যোগাযোগ</span>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">আমাদের সাথে যোগাযোগ করুন</h1>
        <p className="mt-3 text-muted-foreground">যে কোনো প্রশ্ন বা অর্ডারের জন্য আমরা ২৪/৭ আছি।</p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {items.map((c, i) => {
          const Inner = (
            <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></div>
              <div>
                <div className="text-sm font-bold">{c.t}</div>
                <div className="mt-0.5 text-foreground/80">{c.v}</div>
              </div>
            </div>
          );
          return c.href ? <a key={i} href={c.href}>{Inner}</a> : <div key={i}>{Inner}</div>;
        })}
      </div>
    </div>
  );
}