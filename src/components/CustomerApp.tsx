import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Star, Heart, Filter, Search, User, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  category: string;
  cbd_percentage: number | null;
  thc_percentage: number | null;
  strain_type: string | null;
  weight_grams: number | null;
  is_available: boolean;
  brand_id: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CustomerAppProps {
  onCheckout?: (items: CartItem[], total: number) => void;
}

const CustomerApp = ({ onCheckout }: CustomerAppProps) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [...new Set(products.map(product => product.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-white/80">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('/lovable-uploads/100c1251-d4f7-413c-a115-dbbfa5066289.png')`
    }}>
      <div className="min-h-screen bg-black/60 backdrop-blur-sm">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            {/* Top row with centered logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/bff2ab24-8836-4dfa-836d-bff37b607cfa.png" 
                alt="TD Studios" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Bottom row with CABANA text and cart button */}
            <div className="flex items-center justify-center relative">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">CABANA</h1>
              </div>
              <div className="absolute right-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => {
                    if (cart.length > 0 && onCheckout) {
                      onCheckout(cart, cartTotal);
                    } else if (cart.length > 0) {
                      // Store cart data and navigate to checkout
                      sessionStorage.setItem('cartItems', JSON.stringify(cart));
                      sessionStorage.setItem('cartTotal', cartTotal.toString());
                      navigate('/checkout');
                    } else {
                      toast.info('Add items to cart first!');
                    }
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cart.length})
                  {cart.length > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">
                      ${(cartTotal / 100).toFixed(2)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="aspect-square mb-4 bg-white/5 rounded-lg overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl">🌿</span>
                          </div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                      <Badge variant="secondary" className="mt-1 bg-white/20 text-white/80">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {product.description && (
                      <p className="text-white/70 text-sm line-clamp-2">{product.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-white">${(product.price / 100).toFixed(2)}</span>
                        {product.weight_grams && (
                          <span className="text-white/60 text-sm ml-2">/ {product.weight_grams}g</span>
                        )}
                      </div>
                    </div>
                    
                    {(product.thc_percentage || product.cbd_percentage) && (
                      <div className="flex gap-2">
                        {product.thc_percentage && (
                          <Badge variant="outline" className="border-red-400/50 text-red-300 bg-red-500/10">
                            THC: {product.thc_percentage}%
                          </Badge>
                        )}
                        {product.cbd_percentage && (
                          <Badge variant="outline" className="border-green-400/50 text-green-300 bg-green-500/10">
                            CBD: {product.cbd_percentage}%
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/20 text-white/80 hover:bg-white/20"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 text-xl mb-4">No products found</div>
              <p className="text-white/40">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <img 
                  src="/lovable-uploads/bff2ab24-8836-4dfa-836d-bff37b607cfa.png" 
                  alt="Cabana" 
                  className="h-8 w-auto"
                />
                <p className="text-white/60 text-sm">
                  Premium cannabis delivery service bringing you the finest products right to your door.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    <span className="sr-only">Instagram</span>
                    <div className="w-6 h-6 bg-white/20 rounded"></div>
                  </a>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <div className="w-6 h-6 bg-white/20 rounded"></div>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Shop All</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Flower</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Edibles</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Pre-rolls</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Track Order</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Returns</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Follow @cabana</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-white/10 rounded-lg"></div>
                  <div className="aspect-square bg-white/10 rounded-lg"></div>
                  <div className="aspect-square bg-white/10 rounded-lg"></div>
                  <div className="aspect-square bg-white/10 rounded-lg"></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="text-white/60 text-sm">
                © 2024 Cabana. All rights reserved. Please consume responsibly.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CustomerApp;