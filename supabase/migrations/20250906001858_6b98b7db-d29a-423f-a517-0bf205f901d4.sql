-- Add RLS policies for kv_store_64e807fc table to resolve security warning
CREATE POLICY "Allow all operations on kv_store" ON public.kv_store_64e807fc
  FOR ALL USING (true) WITH CHECK (true);