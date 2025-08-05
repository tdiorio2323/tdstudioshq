-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'brand', 'customer');

-- Create user_roles table for proper RBAC
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = required_role
  );
$$;

-- Create function to handle new user registration with proper role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'customer'
  );
  
  -- Insert default customer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for users table to use proper role checking
DROP POLICY IF EXISTS "System can manage users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create secure RLS policies for users table
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update brands table RLS policies for better security
DROP POLICY IF EXISTS "System can manage brands" ON public.brands;

CREATE POLICY "Brand owners can manage their brands"
ON public.brands
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'brand')
);

-- Update products table RLS policies
DROP POLICY IF EXISTS "Brand owners can manage their products" ON public.products;

CREATE POLICY "Brand owners can manage their products"
ON public.products
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  (public.has_role(auth.uid(), 'brand') AND brand_id IN (
    SELECT id FROM public.brands WHERE id = products.brand_id
  ))
);

-- Update orders table RLS policies
DROP POLICY IF EXISTS "Brand owners can view orders for their brand" ON public.orders;

CREATE POLICY "Brand owners can manage orders for their brand"
ON public.orders
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR
  (public.has_role(auth.uid(), 'brand') AND brand_id IN (
    SELECT id FROM public.brands WHERE id = orders.brand_id
  )) OR
  (public.has_role(auth.uid(), 'customer') AND customer_id = auth.uid())
);

-- Update subscriptions table RLS policies
DROP POLICY IF EXISTS "Brand owners can view their subscription" ON public.subscriptions;

CREATE POLICY "Brand owners can manage their subscription"
ON public.subscriptions
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR
  (public.has_role(auth.uid(), 'brand') AND brand_id IN (
    SELECT id FROM public.brands WHERE id = subscriptions.brand_id
  ))
);