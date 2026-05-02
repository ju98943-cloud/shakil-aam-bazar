import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">৪০৪</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h2>
        <p className="mt-2 text-sm text-muted-foreground">আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই বা সরানো হয়েছে।</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mangooz — খাঁটি রাজশাহীর আম" },
      { name: "description", content: "সরাসরি বাগান থেকে আপনার ঘরে। ফরমালিন মুক্ত হিমসাগর, ল্যাংড়া, আম্রপালি ও ফজলি আম।" },
      { property: "og:title", content: "Mangooz — খাঁটি রাজশাহীর আম" },
      { property: "og:description", content: "সরাসরি বাগান থেকে আপনার ঘরে। ফরমালিন মুক্ত হিমসাগর, ল্যাংড়া, আম্রপালি ও ফজলি আম।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Mangooz — খাঁটি রাজশাহীর আম" },
      { name: "twitter:description", content: "সরাসরি বাগান থেকে আপনার ঘরে। ফরমালিন মুক্ত হিমসাগর, ল্যাংড়া, আম্রপালি ও ফজলি আম।" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/befb377c-e1b1-494b-b859-6f166dbfea17/id-preview-0c5faf82--b0120f51-0fc6-4ee6-84b8-5840fd1c6910.lovable.app-1777528864081.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/befb377c-e1b1-494b-b859-6f166dbfea17/id-preview-0c5faf82--b0120f51-0fc6-4ee6-84b8-5840fd1c6910.lovable.app-1777528864081.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1"><Outlet /></main>
        <Footer />
      </div>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}

const queryClient = new QueryClient();
