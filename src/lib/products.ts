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
  preorder?: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "amrapali",
    name: "আম রুপালি",
    description: "অসাধারণ মিষ্টি ও সুগন্ধি আম রুপালি — আঁশবিহীন, রসালো ও পুষ্টিকর। শীঘ্রই আসছে।",
    price: 0,
    original_price: null,
    image_url: mangoAmrapali,
    weight: "১০ কেজি / ২০ কেজি বক্স",
    preorder: true,
  },
  {
    id: "2",
    slug: "himsagar",
    name: "হিমসাগর আম",
    description: "রাজশাহীর সবচেয়ে মিষ্টি ও সুগন্ধি হিমসাগর আম। হাতে বাছাই করা প্রিমিয়াম মান।",
    price: 0,
    original_price: null,
    image_url: mangoHimsagar,
    weight: "১০ কেজি / ২০ কেজি বক্স",
    preorder: true,
  },
  {
    id: "3",
    slug: "nak-fazli",
    name: "নাক ফজলি",
    description: "ছোট নাকের মতো দেখতে — অপূর্ব স্বাদের নাক ফজলি আম। মৌসুমে পাওয়া যাবে।",
    price: 0,
    original_price: null,
    image_url: mangoFazli,
    weight: "১০ কেজি / ২০ কেজি বক্স",
    preorder: true,
  },
  {
    id: "4",
    slug: "nana-mango",
    name: "নানা ম্যাংগো",
    description: "বিশেষ জাতের নানা ম্যাংগো — মিষ্টি, রসালো ও সুগন্ধে ভরপুর।",
    price: 0,
    original_price: null,
    image_url: mangoHimsagar,
    weight: "১০ কেজি / ২০ কেজি বক্স",
    preorder: true,
  },
  {
    id: "5",
    slug: "gopalbhog",
    name: "গোপালভোগ",
    description: "সর্বপ্রথম মৌসুমে আসা মিষ্টি গোপালভোগ আম — সুমিষ্ট স্বাদ ও অপূর্ব গন্ধ।",
    price: 0,
    original_price: null,
    image_url: mangoAmrapali,
    weight: "১০ কেজি / ২০ কেজি বক্স",
    preorder: true,
  },
  {
    id: "6",
    slug: "langra",
    name: "ল্যাংড়া আম",
    description: "চাপাইনবাবগঞ্জের বিখ্যাত ল্যাংড়া আম — রসালো, মিষ্টি ও সুগন্ধযুক্ত।",
    price: 0,
    original_price: null,
    image_url: mangoLangra,
    weight: "১০ কেজি / ২০ কেজি বক্স",
    preorder: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}