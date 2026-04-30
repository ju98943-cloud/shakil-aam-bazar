
-- Recreate INSERT policies explicitly granting anon + authenticated
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
DROP POLICY IF EXISTS "Anyone can add order items" ON public.order_items;

CREATE POLICY "Anyone can place an order"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can add order items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
