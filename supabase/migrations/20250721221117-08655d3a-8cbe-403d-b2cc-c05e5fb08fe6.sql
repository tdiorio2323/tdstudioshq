-- Create product categories enum
CREATE TYPE public.product_category AS ENUM ('flower', 'edibles', 'pre_rolls', 'disposable_vapes', 'concentrate');

-- Create subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('basic', 'premium', 'enterprise');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');

-- Create subscriptions table for brands
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL,
  tier subscription_tier NOT NULL DEFAULT 'basic',
  is_active BOOLEAN NOT NULL DEFAULT true,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_price INTEGER NOT NULL DEFAULT 14900, -- $149/month in cents
  trial_end_date TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  price INTEGER NOT NULL, -- Price in cents
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  thc_percentage DECIMAL(5,2),
  cbd_percentage DECIMAL(5,2),
  strain_type TEXT, -- indica, sativa, hybrid
  weight_grams DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  brand_id UUID NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL, -- Total in cents
  subtotal INTEGER NOT NULL,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  customer_notes TEXT,
  delivery_address JSONB, -- Store address as JSON
  estimated_delivery TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- Price per unit in cents
  total_price INTEGER NOT NULL, -- quantity * unit_price
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create cart table for persistent cart storage
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Brand owners can view their subscription" 
ON public.subscriptions 
FOR ALL 
USING (brand_id IN (SELECT id FROM brands WHERE id = brand_id));

-- RLS Policies for products
CREATE POLICY "Anyone can view available products" 
ON public.products 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Brand owners can manage their products" 
ON public.products 
FOR ALL 
USING (brand_id IN (SELECT id FROM brands WHERE id = brand_id));

-- RLS Policies for orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (customer_id = auth.uid());

CREATE POLICY "Brand owners can view orders for their brand" 
ON public.orders 
FOR ALL 
USING (brand_id IN (SELECT id FROM brands WHERE id = brand_id));

CREATE POLICY "Customers can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (customer_id = auth.uid());

-- RLS Policies for order items
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items 
FOR SELECT 
USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid() OR brand_id IN (SELECT id FROM brands WHERE id = brand_id)));

CREATE POLICY "Users can insert order items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));

-- RLS Policies for cart items
CREATE POLICY "Users can manage their own cart" 
ON public.cart_items 
FOR ALL 
USING (user_id = auth.uid());

-- RLS Policies for brands (public read, admin manage)
CREATE POLICY "Anyone can view active brands" 
ON public.brands 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "System can manage brands" 
ON public.brands 
FOR ALL 
USING (true);

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (id = auth.uid());

CREATE POLICY "System can manage users" 
ON public.users 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();