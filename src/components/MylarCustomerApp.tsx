import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Menu, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
// Ocean-themed background for mylar shop
import { MYLAR_PRODUCTS, MYLAR_CATEGORIES, MylarProduct } from '@/data/mylarProducts';

const MylarCustomerApp = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<MylarProduct | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(4);
  const [contactName, setContactName] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return MYLAR_PRODUCTS.filter(p => p.active !== false);
  }, []);

  const getCurrentPrice = (product: MylarProduct) => {
    if (product.hasQuantityOptions && product.quantityOptions) {
      const option = product.quantityOptions.find(opt => opt.quantity === selectedQuantity);
      return option ? option.price : product.basePrice;
    }
    return product.basePrice;
  };

  const handleCashAppCheckout = (product: MylarProduct) => {
    const currentPrice = getCurrentPrice(product);

    if (!contactName.trim()) {
      toast.error('Please enter your contact name');
      return;
    }

    if (!designNotes.trim()) {
      toast.error('Please provide design notes');
      return;
    }

    // Create order summary
    const orderSummary = {
      product: product.name,
      quantity: product.hasQuantityOptions ? selectedQuantity : 1,
      price: currentPrice,
      contactName,
      socialMedia,
      designNotes,
      hasFiles: uploadedFiles && uploadedFiles.length > 0
    };

    // Store order details for confirmation
    sessionStorage.setItem('mylarOrder', JSON.stringify(orderSummary));

    toast.success(`Order details saved! Opening CashApp profile - you can enter $${currentPrice}`, {
      duration: 8000,
    });

    // Open CashApp profile - user will enter amount manually
    const cashAppUrl = `https://cash.app/$tdiorio23`;
    window.open(cashAppUrl, '_blank');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(e.target.files);
      toast.success(`${e.target.files.length} file(s) selected`);
    }
  };

  const ProductCard = ({ product }: { product: MylarProduct }) => (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
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
              {product.category}
            </Badge>
          </div>

          {product.description && (
            <p className="text-white/70 text-sm line-clamp-2">{product.description}</p>
          )}

          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-white">
                ${product.hasQuantityOptions ? `${getCurrentPrice(product)}` : product.basePrice.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => setSelectedProduct(product)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Customize Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-black">
        <div className="min-h-screen bg-black/40 backdrop-blur-sm">
          {/* Header */}
          <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 relative">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              >
                ← <span className="hidden sm:inline ml-1">Back</span>
              </Button>

              {/* Centered Logo */}
              <div className="flex flex-col items-center space-y-2 w-full">
                  <img
                    src="/lovable-uploads/bff2ab24-8836-4dfa-836d-bff37b607cfa.png"
                    alt="TD Studios"
                    className="h-20 sm:h-24 md:h-32 w-auto"
                  />

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex space-x-6 text-white/80 text-sm">
                    <a href="/" className="hover:text-white transition-colors">Home</a>
                    <a href="/shop" className="hover:text-white transition-colors">Shop All</a>
                    <a href="/mylars" className="hover:text-white transition-colors font-semibold">Mylar Bags</a>
                    <a href="#" className="hover:text-white transition-colors">T-shirts</a>
                    <a href="#" className="hover:text-white transition-colors">Outerwear</a>
                    <a href="#" className="hover:text-white transition-colors">Hats</a>
                    <a href="#" className="hover:text-white transition-colors">Accessories</a>
                  </nav>
                </div>

              {/* Hamburger Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-white/10 md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>

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
                      className="text-white hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10 font-semibold"
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

          {/* Product Details */}
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Form */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{selectedProduct.name}</h1>
                    <p className="text-white/70">{selectedProduct.description}</p>
                  </div>

                  {selectedProduct.hasQuantityOptions && (
                    <div>
                      <Label className="text-white mb-2 block">Number of Designs</Label>
                      <Select value={selectedQuantity.toString()} onValueChange={(value) => setSelectedQuantity(parseInt(value))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct.quantityOptions?.map((option) => (
                            <SelectItem key={option.quantity} value={option.quantity.toString()}>
                              {option.quantity} designs - ${option.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="text-3xl font-bold text-white">
                    Total: ${getCurrentPrice(selectedProduct).toFixed(2)}
                  </div>

                  {/* Customer Info Form */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white mb-2 block">Contact Name *</Label>
                      <Input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your full name"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">Social Media Name/Link</Label>
                      <Input
                        value={socialMedia}
                        onChange={(e) => setSocialMedia(e.target.value)}
                        placeholder="@username or profile link"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">Design Notes *</Label>
                      <Textarea
                        value={designNotes}
                        onChange={(e) => setDesignNotes(e.target.value)}
                        placeholder="Describe the type of design you want for your mylar bags..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[120px]"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">Upload References</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:rounded"
                      />
                      {uploadedFiles && uploadedFiles.length > 0 && (
                        <p className="text-white/70 text-sm mt-1">
                          {uploadedFiles.length} file(s) selected
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CashApp Checkout */}
                  <Button
                    onClick={() => handleCashAppCheckout(selectedProduct)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Open CashApp Profile ($${getCurrentPrice(selectedProduct)})
                  </Button>

                  <p className="text-white/60 text-sm text-center">
                    Click the button above to open CashApp profile - enter the amount shown and send to $tdiorio23
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between md:justify-center">
              {/* Empty spacer for mobile balance */}
              <div className="md:hidden w-10"></div>

              {/* Centered Logo */}
              <div className="flex flex-col items-center space-y-2 flex-1">
                <img
                  src="/lovable-uploads/bff2ab24-8836-4dfa-836d-bff37b607cfa.png"
                  alt="TD Studios"
                  className="h-20 sm:h-24 md:h-32 w-auto"
                />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 text-white/80 text-sm">
                  <a href="/" className="hover:text-white transition-colors">Home</a>
                  <a href="/shop" className="hover:text-white transition-colors">Shop All</a>
                  <a href="/mylars" className="hover:text-white transition-colors font-semibold">Mylar Bags</a>
                  <a href="#" className="hover:text-white transition-colors">T-shirts</a>
                  <a href="#" className="hover:text-white transition-colors">Outerwear</a>
                  <a href="#" className="hover:text-white transition-colors">Hats</a>
                  <a href="#" className="hover:text-white transition-colors">Accessories</a>
                </nav>
              </div>

              {/* Hamburger Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-white/10 md:hidden absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
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
                    className="text-white hover:text-white transition-colors px-2 py-2 rounded hover:bg-white/10 font-semibold"
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Custom Mylar Bag Designs</h1>
            <p className="text-white/70 text-lg">Professional mylar bag design services for your brand</p>
          </div>


          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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
              © 2024 TD Studios. All rights reserved. Professional design services.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MylarCustomerApp;