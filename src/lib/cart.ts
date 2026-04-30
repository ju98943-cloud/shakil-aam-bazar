import { useEffect, useState, useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  weight: string | null;
  quantity: number;
};

const STORAGE_KEY = "shakil_aam_cart_v1";
let items: CartItem[] = [];
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    items = raw ? JSON.parse(raw) : [];
  } catch { items = []; }
}
function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  listeners.forEach((l) => l());
}

let loaded = false;
function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") { load(); loaded = true; }
}

export const cart = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  getSnapshot() { ensureLoaded(); return items; },
  getServerSnapshot() { return [] as CartItem[]; },
  add(item: Omit<CartItem, "quantity">, qty = 1) {
    ensureLoaded();
    const existing = items.find((i) => i.id === item.id);
    if (existing) existing.quantity += qty;
    else items = [...items, { ...item, quantity: qty }];
    persist();
  },
  setQty(id: string, qty: number) {
    ensureLoaded();
    if (qty <= 0) items = items.filter((i) => i.id !== id);
    else items = items.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
    persist();
  },
  remove(id: string) { ensureLoaded(); items = items.filter((i) => i.id !== id); persist(); },
  clear() { items = []; persist(); },
};

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.getSnapshot, cart.getServerSnapshot);
}
export function useCartHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
