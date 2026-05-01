import mangoHimsagar from "@/assets/mango-himsagar.jpg";
import mangoLangra from "@/assets/mango-langra.jpg";
import mangoAmrapali from "@/assets/mango-amrapali.jpg";
import mangoFazli from "@/assets/mango-fazli.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  weight: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "himsagar",
    name: "হিমসাগর আম",
    description: "রাজশাহীর সবচেয়ে মিষ্টি ও সুগন্ধি আম। হিমসাগর আমের মিষ্টতা ও গন্ধ অতুলনীয়। প্রতিটি আম হাতে বাছাই করা।",
    price: 850,
    original_price: 1000,
    image_url: mangoHimsagar,
    weight: "৬ কেজি বক্স",
  },
  {
    id: "2",
    slug: "langra",
    name: "ল্যাংড়া আম",
    description: "অসাধারণ স্বাদের ল্যাংড়া আম — রসালো, মিষ্টি এবং সুগন্ধযুক্ত। চাপাইনবাবগঞ্জের বিশেষ জাত।",
    price: 750,
    original_price: 900,
    image_url: mangoLangra,
    weight: "৬ কেজি বক্স",
  },
  {
    id: "3",
    slug: "amrapali",
    name: "আম্রপালি আম",
    description: "ছোট আকারের অত্যন্ত মিষ্টি আম। আম্রপালি আম রং ও স্বাদে চমৎকার, আঁশবিহীন।",
    price: 650,
    original_price: 800,
    image_url: mangoAmrapali,
    weight: "৬ কেজি বক্স",
  },
  {
    id: "4",
    slug: "fazli",
    name: "ফজলি আম",
    description: "বড় আকারের সুস্বাদু ফজলি আম। জুস, আচার ও সরাসরি খাওয়ার জন্য উপযুক্ত।",
    price: 600,
    original_price: 750,
    image_url: mangoFazli,
    weight: "৬ কেজি বক্স",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}