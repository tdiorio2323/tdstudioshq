-- Fix function search path issues for security functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = required_role
  );
$$;

-- Fix RLS policies to require authentication instead of allowing anonymous access
-- Update brands table policies
DROP POLICY IF EXISTS "Anyone can view active brands" ON public.brands;
DROP POLICY IF EXISTS "Brand owners can manage their brands" ON public.brands;

CREATE POLICY "Authenticated users can view active brands"
ON public.brands
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Brand owners can manage their brands"
ON public.brands
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'brand')
);

-- Update products table policies
DROP POLICY IF EXISTS "Anyone can view available products" ON public.products;
DROP POLICY IF EXISTS "Brand owners can manage their products" ON public.products;

CREATE POLICY "Authenticated users can view available products"
ON public.products
FOR SELECT
TO authenticated
USING (is_available = true);

CREATE POLICY "Brand owners can manage their products"
ON public.products
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  (public.has_role(auth.uid(), 'brand') AND brand_id IN (
    SELECT id FROM public.brands WHERE id = products.brand_id
  ))
);

-- Update cart_items policies
DROP POLICY IF EXISTS "Users can manage their own cart" ON public.cart_items;

CREATE POLICY "Users can manage their own cart"
ON public.cart_items
FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Update order_items policies
DROP POLICY IF EXISTS "Users can view order items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert order items for their orders" ON public.order_items;

CREATE POLICY "Users can view order items for their orders"
ON public.order_items
FOR SELECT
TO authenticated
USING (order_id IN (
  SELECT orders.id FROM orders 
  WHERE orders.customer_id = auth.uid() OR 
        public.has_role(auth.uid(), 'admin') OR
        (public.has_role(auth.uid(), 'brand') AND orders.brand_id IN (
          SELECT id FROM public.brands WHERE id = orders.brand_id
        ))
));

CREATE POLICY "Users can insert order items for their orders"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (order_id IN (
  SELECT orders.id FROM orders WHERE orders.customer_id = auth.uid()
));

-- Update orders policies  
DROP POLICY IF EXISTS "Brand owners can manage orders for their brand" ON public.orders;
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;

CREATE POLICY "Users can manage their own orders"
ON public.orders
FOR ALL
TO authenticated
USING (
  customer_id = auth.uid() OR
  public.has_role(auth.uid(), 'admin') OR
  (public.has_role(auth.uid(), 'brand') AND brand_id IN (
    SELECT id FROM public.brands WHERE id = orders.brand_id
  ))
);

-- Update subscriptions policies
DROP POLICY IF EXISTS "Brand owners can manage their subscription" ON public.subscriptions;

CREATE POLICY "Brand owners can manage their subscription"
ON public.subscriptions
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  (public.has_role(auth.uid(), 'brand') AND brand_id IN (
    SELECT id FROM public.brands WHERE id = subscriptions.brand_id
  ))
);

-- Update user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));