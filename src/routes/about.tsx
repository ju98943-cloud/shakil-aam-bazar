import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Heart, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "আমাদের সম্পর্কে | Shakil AAM Bazar" }, { name: "description", content: "Shakil AAM Bazar — রাজশাহী থেকে সরাসরি আম সরবরাহকারী।" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">আমাদের গল্প</span>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">আমাদের সম্পর্কে</h1>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-foreground/80">
        Shakil AAM Bazar প্রতিষ্ঠিত হয়েছে একটি সহজ স্বপ্ন নিয়ে — বাংলাদেশের প্রতিটি ঘরে পৌঁছে দেওয়া রাজশাহীর খাঁটি, ফরমালিন মুক্ত ও প্রকৃতির আশীর্বাদে পরিপূর্ণ আম।
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { icon: Leaf, t: "প্রাকৃতিক", d: "কোনো রাসায়নিক বা ফরমালিন ছাড়াই পরিপক্ক করা" },
          { icon: Heart, t: "যত্নে নির্বাচিত", d: "প্রতিটি আম হাতে বাছাই করে প্যাকেজিং করা হয়" },
          { icon: Award, t: "প্রিমিয়াম মান", d: "শুধুমাত্র সেরা মানের আম আপনার কাছে পৌঁছে" },
        ].map((f, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-6 w-6" /></div>
            <h3 className="font-bold">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}