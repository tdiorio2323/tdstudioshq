import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Star, Heart, Filter, Search, User, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import grassBackground from '@/assets/grass-background.jpg';
import { PRODUCTS, CATEGORIES, Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CustomerAppProps {
  onCheckout?: (items: CartItem[], total: number) => void;
}

const CustomerApp = ({ onCheckout }: CustomerAppProps) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartTotal, setCartTotal] = useState(0);

  const filteredProducts = useMemo(() => {
    const base = PRODUCTS.filter(p => p.active !== false);
    const byCat = selectedCategory === 'All' ? base : base.filter(p => p.category === selectedCategory);
    const byText = searchTerm ? byCat.filter(p =>
      (p.name + " " + (p.description ?? "")).toLowerCase().includes(searchTerm.toLowerCase())
    ) : byCat;
    return byText;
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

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


  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${grassBackground})`
    }}>
      <div className="min-h-screen bg-black/60 backdrop-blur-sm">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            {/* Header row with logo and cart */}
            <div className="flex items-start justify-between">
              <div></div> {/* Empty div for spacing */}
              <div className="flex flex-col items-center space-y-4">
                <img
                  src="/lovable-uploads/bff2ab24-8836-4dfa-836d-bff37b607cfa.png"
                  alt="TD Studios"
                  className="h-32 w-auto"
                />
                {/* Navigation Menu */}
                <nav className="flex space-x-6 text-white/80 text-sm">
                  <a href="/" className="hover:text-white transition-colors">Home</a>
                  <a href="/shop" className="hover:text-white transition-colors">Shop All</a>
                  <a href="/mylars" className="hover:text-white transition-colors">Mylar Bags</a>
                  <a href="#" className="hover:text-white transition-colors">T-shirts</a>
                  <a href="#" className="hover:text-white transition-colors">Outerwear</a>
                  <a href="#" className="hover:text-white transition-colors">Hats</a>
                  <a href="#" className="hover:text-white transition-colors">Accessories</a>
                </nav>
              </div>
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
                      ${cartTotal.toFixed(2)}
                    </Badge>
                  )}
              </Button>
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
                  {CATEGORIES.map(category => (
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
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl">📦</span>
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
                        <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    
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
                        className="border-white/20 text-red-500 hover:bg-white/20 hover:text-red-400"
                      >
                        <Heart className="h-4 w-4 fill-red-500" />
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
        <footer className="bg-black/70 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col items-center space-y-4">
            <img
              src="/lovable-uploads/bff2ab24-8836-4dfa-836d-bff37b607cfa.png"
              alt="TD Studios"
              className="h-16 w-auto"
            />
            <div className="text-center text-white/40 text-xs">
              © 2024 TD Studios. All rights reserved. Please consume responsibly.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CustomerApp;
