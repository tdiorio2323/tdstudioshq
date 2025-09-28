import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Menu, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
// Ocean-themed background for mylar shop
import { MYLAR_PRODUCTS, MYLAR_CATEGORIES, MylarProduct } from '@/data/mylarProducts';

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnngnbqy";
const CASH_TAG = "$tdiorio23";

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
  const basePath = '/mylars';
  if (!origin) {
    return slug ? `${basePath}/${slug}` : basePath;
  }
  return slug ? `${origin}${basePath}/${slug}` : `${origin}${basePath}`;
};

const MylarCustomerApp = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const [selectedProduct, setSelectedProduct] = useState<MylarProduct | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(4);
  const [contactName, setContactName] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [designNotes, setDesignNotes] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    if (!slug) {
      setSelectedProduct(null);
      return;
    }

    const matchedProduct = MYLAR_PRODUCTS.find((item) => item.slug === slug);

    if (matchedProduct) {
      setSelectedProduct(matchedProduct);
    } else {
      navigate('/mylars', { replace: true });
    }
  }, [slug, navigate]);

  const handleCashAppCheckout = async (product: MylarProduct) => {
    if (submitting) return;
    setSubmitting(true);

    const price = getCurrentPrice(product);
    if (!contactName.trim() || !designNotes.trim()) {
      toast.error("Enter your name and design notes.");
      setSubmitting(false);
      return;
    }

    const fileNames = uploadedFiles ? Array.from(uploadedFiles).map((file) => file.name) : [];

    const filesLabel = fileNames.length ? fileNames.join(", ") : "None";

    const isMessageForPricing = product.basePrice === 0;
    const priceDisplay = isMessageForPricing ? "Message for Pricing" : `$${price}`;
    const subjectLine = isMessageForPricing ?
      `New Quote Request — ${product.name}` :
      `New Mylar Order — ${product.name} ($${price})`;

    const payload = {
      _subject: subjectLine,
      message: `${isMessageForPricing ? '💬 NEW QUOTE REQUEST' : '🛍️ NEW MYLAR BAG ORDER'}\nProduct: ${product.name}\nPrice: ${priceDisplay}\nQty: ${product.hasQuantityOptions ? selectedQuantity : 1}\nName: ${contactName}\nPhone: ${phoneNumber || "N/A"}\nSocial: ${socialMedia || "N/A"}\nNotes: ${designNotes}\nFiles: ${filesLabel}\n⏰ ${new Date().toLocaleString()}${isMessageForPricing ? '' : `\n💳 Cash App: ${CASH_TAG}`}`,
      contactName,
      productName: product.name,
      price: priceDisplay,
      quantity: product.hasQuantityOptions ? selectedQuantity : 1,
      designNotes,
      socialMedia: socialMedia || "N/A",
      phoneNumber: phoneNumber || "N/A",
      files: filesLabel,
      // optional if you add a customer email field:
      // _replyto: customerEmail,
    };

    sessionStorage.setItem("mylarOrder", JSON.stringify(payload));

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseBody = await response.text();
      console.log("Formspree:", response.status, responseBody);
      if (!response.ok) {
        throw new Error(`Formspree ${response.status}: ${responseBody}`);
      }

      if (isMessageForPricing) {
        toast.success("Quote request sent successfully! We'll get back to you soon.", { duration: 6000 });
      } else {
        toast.success(`Order sent. Opening Cash App for $${price}.`, { duration: 6000 });
        window.open(`https://cash.app/${CASH_TAG}`, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      console.error("Order submit failed:", e);
      if (isMessageForPricing) {
        toast.error("We couldn't submit your quote request. Please try again.", { duration: 6000 });
      } else {
        toast.error("We couldn't submit your details. We'll still open Cash App.", { duration: 6000 });
        window.open(`https://cash.app/${CASH_TAG}`, "_blank", "noopener,noreferrer");
      }
    } finally {
      setSubmitting(false);
    }
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
                {product.basePrice === 0 ? 'Message for Pricing' :
                 product.hasQuantityOptions ? `$${getCurrentPrice(product)}` : `$${product.basePrice.toFixed(2)}`}
              </span>
            </div>
          </div>

          <Button
            onClick={() => {
              setSelectedProduct(product);
              navigate(`/mylars/${product.slug}`);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Customize Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedProduct) {
    const product = selectedProduct;
    const productTitle = `${product.name} | TD Studios Mylar Bags`;
    const productDescription = product.description ?? 'Custom mylar bag design and ordering from TD Studios.';
    const productUrl = buildCanonicalUrl(product.slug);
    const productImage = buildAbsoluteUrl(product.image);

    return (
      <>
        <Helmet>
          <title>{productTitle}</title>
          <meta name="description" content={productDescription} />
          <link rel="canonical" href={productUrl} />

          <meta property="og:type" content="product" />
          <meta property="og:site_name" content="TD Studios" />
          <meta property="og:title" content={productTitle} />
          <meta property="og:description" content={productDescription} />
          <meta property="og:url" content={productUrl} />
          <meta property="og:image" content={productImage} />
          <meta property="og:image:alt" content={product.name} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={productTitle} />
          <meta name="twitter:description" content={productDescription} />
          <meta name="twitter:image" content={productImage} />
    {selectedProduct && (
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: selectedProduct.name,
            image: abs(selectedProduct.image),
            description: selectedProduct.description || "Custom mylar bag design",
            brand: "TD Studios",
            sku: selectedProduct.slug,
            offers: {
              "@type": "Offer",
              url: window.location.href,
              priceCurrency: "USD",
              price: selectedProduct.price || "",
              availability: "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
    )}
        </Helmet>

        <div className="min-h-screen bg-cover bg-center bg-no-repeat md:bg-black bg-[url('/times%20square')]">
          <div className="min-h-screen bg-black/40 backdrop-blur-sm">
            {/* Header */}
            <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
              <div className="container mx-auto px-4 py-4 relative">
                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProduct(null);
                    navigate('/mylars');
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                >
                  ← <span className="hidden sm:inline ml-1">Back</span>
                </Button>

                {/* Centered Logo */}
                <div className="flex flex-col items-center space-y-2 w-full">
                  <img
                    src="/td-studios-chrome-metal-logo.png"
                    alt="TD Studios"
                    className="h-7 sm:h-8 md:h-11 w-auto"
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
                  className="text-white hover:bg-white/10 md:hidden absolute right-1 top-1/2 transform -translate-y-1/2 z-10"
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
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Form */}
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                      <p className="text-white/70">{product.description}</p>
                    </div>

                    {product.hasQuantityOptions && (
                      <div>
                        <Label className="text-white mb-2 block">Number of Designs</Label>
                        <Select value={selectedQuantity.toString()} onValueChange={(value) => setSelectedQuantity(parseInt(value))}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {product.quantityOptions?.map((option) => (
                              <SelectItem key={option.quantity} value={option.quantity.toString()}>
                                {option.quantity} designs - ${option.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="text-3xl font-bold text-white">
                      {product.basePrice === 0 ? 'Message for Pricing' : `Total: $${getCurrentPrice(product).toFixed(2)}`}
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
                        <Label className="text-white mb-2 block">Phone Number</Label>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Best number to reach you"
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
                      disabled={submitting}
                      onClick={() => handleCashAppCheckout(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      {product.basePrice === 0 ? 'Contact for Quote' : 'Pay with Cash App'}
                    </Button>

                    <p className="text-white/60 text-sm text-center">
                      {product.basePrice === 0 ?
                        'Click the button above to contact us for a custom quote on this service' :
                        `Click the button above to open CashApp profile - enter the amount shown and send to ${CASH_TAG}`}
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }

  const listingTitle = "Mylar Bags | TD Studios";
  const listingDescription = "Customize premium mylar bag designs and submit your order through TD Studios.";
  const listingUrl = buildCanonicalUrl();
  const listingImage = buildAbsoluteUrl(MYLAR_PRODUCTS[0]?.image);

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
        <meta property="og:image:alt" content="TD Studios Mylar Bags" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={listingTitle} />
        <meta name="twitter:description" content={listingDescription} />
        <meta name="twitter:image" content={listingImage} />
      </Helmet>
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
                  src="/td-studios-chrome-metal-logo.png"
                  alt="TD Studios"
                  className="h-7 sm:h-8 md:h-11 w-auto"
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
                className="text-white hover:bg-white/10 md:hidden absolute right-1 top-1/2 transform -translate-y-1/2"
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
              src="/td-studios-chrome-metal-logo.png"
              alt="TD Studios"
              className="h-5 w-auto"
            />
            <div className="text-center text-white/40 text-xs">
              © 2024 TD Studios. All rights reserved. Professional design services.
            </div>
          </div>
        </footer>
        </div>
      </div>
    </>
  );
};

export default MylarCustomerApp;

