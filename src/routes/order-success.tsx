import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-success")({
  validateSearch: (s: Record<string, unknown>) => ({ o: (s.o as string | undefined) }),
  component: SuccessPage,
});

function SuccessPage() {
  const { o } = Route.useSearch();
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <CheckCircle2 className="mx-auto h-20 w-20 text-primary" />
      <h1 className="mt-6 text-3xl font-bold">ধন্যবাদ! অর্ডার সম্পন্ন</h1>
      <p className="mt-3 text-muted-foreground">আপনার অর্ডারটি গৃহীত হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।</p>
      <div className="mt-8"><Link to="/shop" className="inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">আরও কেনাকাটা করুন</Link></div>
    </div>
  );
}