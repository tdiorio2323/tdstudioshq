import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Star, Heart, Filter, Search, User, MapPin, Clock, Menu, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet-async';
// Background image will be set via URL
import { PRODUCTS, CATEGORIES, Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface CustomerAppProps {
  onCheckout?: (items: CartItem[], total: number) => void;
}

const getOrigin = () => (typeof window !== 'undefined' ? window.location.origin : '');

const buildAbsoluteUrl = (path?: string) => {
  if (!path) return getOrigin();
  if (path.startsWith('http')) return path;
  const origin = getOrigin();
  if (!origin) return path;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
};

const buildCanonicalUrl = (slug?: string) => {
  const origin = getOrigin();
  const basePath = '/shop';
  if (!origin) {
    return slug ? `${basePath}/${slug}` : basePath;
  }
  return slug ? `${origin}${basePath}/${slug}` : `${origin}${basePath}`;
};

const CustomerApp = ({ onCheckout }: CustomerAppProps) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    // Check if size is required (only outerwear requires sizes, all hats are One Size)
    const requiresSize = product.category !== 'Hats';
    const selectedSize = selectedSizes[product.id];

    if (requiresSize && !selectedSize) {
      toast.error('Please select a size first');
      return;
    }

    setCart(prevCart => {
      // For sized items, check if same product with same size exists
      const existingItem = prevCart.find(item =>
        item.id === product.id && (!requiresSize || item.size === selectedSize)
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && (!requiresSize || item.size === selectedSize)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, size: selectedSize }];
    });
    toast.success(`${product.name}${selectedSize ? ` (${selectedSize})` : ''} added to cart`);
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

  const listingTitle = "Shop | TD Studios";
  const listingDescription = "Browse the latest drops from TD Studios.";
  const listingUrl = buildCanonicalUrl();
  const listingImage = buildAbsoluteUrl(PRODUCTS[0]?.image);

  return (
    <>
      <Helmet>
        <title>{listingTitle}</title>
        <meta name="description" content={listingDescription} />
        <link rel="canonical" href={listingUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TD Studios" />
        <meta property="og:title" content={listingTitle} />
        <meta property="og:description" content={listingDescription} />
        <meta property="og:url" content={listingUrl} />
        <meta property="og:image" content={listingImage} />
        <meta property="og:image:alt" content="TD Studios Products" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={listingTitle} />
        <meta name="twitter:description" content={listingDescription} />
        <meta name="twitter:image" content={listingImage} />
      </Helmet>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat md:bg-[url('https://images.unsplash.com/photo-1743592323402-2a8392831f44?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-[url('/times%20square')]">
        <div className="min-h-screen bg-black/60 backdrop-blur-sm">
          {/* Header */}
          <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile header with logo and controls */}
              <div className="md:hidden flex items-center justify-between">
                {/* Cart Button on Left */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 [&>svg]:text-white"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2 text-white" />
                    <span className="hidden sm:inline text-white">Cart</span> <span className="text-white">({cart.length})</span>
                  </Button>

                  {/* Cart Dropdown */}
                  {isCartOpen && cart.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {cart.map((item, index) => (
                          <div key={`${item.id}-${item.size}-${index}`} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 text-white text-sm">
                              <div className="font-medium">{item.name}</div>
                              {item.size && <div className="text-white/60">Size: {item.size}</div>}
                              <div className="text-white/80">${item.price.toFixed(2)} x {item.quantity}</div>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-white/20 pt-3 mt-3">
                          <div className="flex justify-between text-white font-semibold">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <Button
                            className="w-full mt-3 bg-primary hover:bg-primary/90"
                            onClick={() => {
                              setIsCartOpen(false);
                              if (onCheckout) {
                                onCheckout(cart, cartTotal);
                              } else {
                                sessionStorage.setItem('cartItems', JSON.stringify(cart));
                                sessionStorage.setItem('cartTotal', cartTotal.toString());
                                navigate('/checkout');
                              }
                            }}
                          >
                            Checkout
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Perfectly Centered Logo on Mobile */}
                <img
                  src="/td-studios-chrome-metal-logo.png"
                  alt="TD Studios"
                  className="h-7 sm:h-8 w-auto"
                />

                {/* Hamburger Menu Button on Right */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:bg-white/10 p-4 rounded-md"
                >
                  {isMenuOpen ?
                    <X className="h-10 w-10" style={{ width: '40px', height: '40px' }} /> :
                    <Menu className="h-10 w-10" style={{ width: '40px', height: '40px' }} />
                  }
                </button>
              </div>

              {/* Desktop header with centered logo and navigation */}
              <div className="hidden md:block">
                {/* Logo and Cart row */}
                <div className="flex items-center justify-between mb-4">
                  {/* Empty spacer */}
                  <div className="w-32"></div>

                  {/* Centered Logo */}
                  <img
                    src="/td-studios-chrome-metal-logo.png"
                    alt="TD Studios"
                    className="h-11 w-auto"
                  />

                  {/* Cart Button */}
                  <div className="w-32 flex justify-end relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 [&>svg]:text-white"
                      onClick={() => setIsCartOpen(!isCartOpen)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2 text-white" />
                      <span className="text-white">Cart ({cart.length})</span>
                    </Button>

                    {/* Desktop Cart Dropdown */}
                    {isCartOpen && cart.length > 0 && (
                      <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
                        <div className="space-y-3">
                          {cart.map((item, index) => (
                            <div key={`${item.id}-${item.size}-${index}`} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 text-white text-sm">
                                <div className="font-medium">{item.name}</div>
                                {item.size && <div className="text-white/60">Size: {item.size}</div>}
                                <div className="text-white/80">${item.price.toFixed(2)} x {item.quantity}</div>
                              </div>
                            </div>
                          ))}
                          <div className="border-t border-white/20 pt-3 mt-3">
                            <div className="flex justify-between text-white font-semibold">
                              <span>Total:</span>
                              <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <Button
                              className="w-full mt-3 bg-primary hover:bg-primary/90"
                              onClick={() => {
                                setIsCartOpen(false);
                                if (onCheckout) {
                                  onCheckout(cart, cartTotal);
                                } else {
                                  sessionStorage.setItem('cartItems', JSON.stringify(cart));
                                  sessionStorage.setItem('cartTotal', cartTotal.toString());
                                  navigate('/checkout');
                                }
                              }}
                            >
                              Checkout
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Centered Navigation */}
                <nav className="flex justify-center space-x-6 text-white/80 text-sm">
                  <a href="/" className="hover:text-white transition-colors">Home</a>
                  <a href="/shop" className="hover:text-white transition-colors">Shop All</a>
                  <a href="/mylars" className="hover:text-white transition-colors">Mylar Bags</a>
                  <a href="#" className="hover:text-white transition-colors">T-shirts</a>
                  <a href="#" className="hover:text-white transition-colors">Outerwear</a>
                  <a href="#" className="hover:text-white transition-colors">Hats</a>
                  <a href="#" className="hover:text-white transition-colors">Accessories</a>
                </nav>
              </div>

              {/* Mobile Navigation Menu */}
              {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-white/10">
                  <nav className="flex flex-col space-y-3 pt-4">
                    <a
                      href="/"
                      className="text-white/80 hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </a>
                    <a
                      href="/shop"
                      className="text-white/80 hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Shop All
                    </a>
                    <a
                      href="/mylars"
                      className="text-white/80 hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mylar Bags
                    </a>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      T-shirts
                    </a>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Outerwear
                    </a>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hats
                    </a>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Accessories
                    </a>
                  </nav>
                </div>
              )}
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="bg-white/20 text-white/80">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('_', ' ')}
                          </Badge>

                          {/* Size Selection - only for outerwear items, hats are all One Size */}
                          {product.category === 'Hats' && (
                            <Badge variant="outline" className="bg-white/10 text-white/90 border-white/30">
                              One Size
                            </Badge>
                          )}
                          {product.category !== 'Hats' && (
                            <div className="flex gap-1 ml-2">
                              {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                <Button
                                  key={size}
                                  variant={selectedSizes[product.id] === size ? "default" : "ghost"}
                                  size="sm"
                                  onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                                  className={`h-6 px-2 text-xs transition-all ${
                                    selectedSizes[product.id] === size
                                      ? 'bg-white/30 text-white border-white/40'
                                      : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/20'
                                  } backdrop-blur-sm`}
                                >
                                  {size}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
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
                src="/td-studios-chrome-metal-logo.png"
                alt="TD Studios"
                className="h-5 w-auto"
              />
              <div className="text-center text-white/40 text-xs">
                © 2024 TD Studios. All rights reserved. Please consume responsibly.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default CustomerApp;
