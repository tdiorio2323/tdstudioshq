import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { PRODUCTS, Product } from "@/data/products";
import { ShoppingCart, ArrowLeft, Share2, Facebook, Twitter, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    navigate('/404');
    return null;
  }

  const requiresSize = ["Apparel", "Outerwear"].includes(product.category);
  const sizes = ["S", "M", "L", "XL", "2XL"];

  const handleAddToCart = () => {
    if (requiresSize && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const cartItem = {
      ...product,
      quantity,
      ...(selectedSize && { size: selectedSize })
    };

    const existingCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    toast.success(`Added ${quantity} ${product.name} to cart`);
    navigate('/shop');
  };

  const shareUrl = `https://tdstudioshq.com/shop/${product.id}`;
  const shareText = `Check out ${product.name} at TD Studios`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
        return;
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - TD Studios Shop</title>
        <meta name="description" content={product.description || `Buy ${product.name} at TD Studios. Premium quality ${product.category.toLowerCase()}.`} />
        <meta property="og:title" content={`${product.name} - TD Studios`} />
        <meta property="og:description" content={product.description || `Premium ${product.category.toLowerCase()}`} />
        <meta property="og:image" content={product.image.startsWith('http') ? product.image : `https://tdstudioshq.com${product.image}`} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - TD Studios`} />
        <meta name="twitter:description" content={product.description || `Premium ${product.category.toLowerCase()}`} />
        <meta name="twitter:image" content={product.image.startsWith('http') ? product.image : `https://tdstudioshq.com${product.image}`} />
        <link rel="canonical" href={shareUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description || `Premium ${product.category.toLowerCase()}`,
            "image": product.image.startsWith('http') ? product.image : `https://tdstudioshq.com${product.image}`,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "brand": {
              "@type": "Brand",
              "name": "TD Studios"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/shop')}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </CardContent>
            </Card>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3" variant="secondary">
                  {product.category}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-primary mb-4">
                  ${product.price.toFixed(2)}
                </p>
                {product.description && (
                  <p className="text-muted-foreground text-lg mb-6">
                    {product.description}
                  </p>
                )}
                {!product.description && (
                  <p className="text-muted-foreground text-lg mb-6">
                    Premium quality {product.category.toLowerCase()} from TD Studios.
                    Made with attention to detail and designed for those who appreciate excellence.
                  </p>
                )}
              </div>

              {/* Size Selection */}
              {requiresSize && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Size <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map(size => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[60px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 p-0"
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-lg h-14"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              {/* Social Share */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-3">Share this product</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare('facebook')}
                    title="Share on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare('twitter')}
                    title="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare('copy')}
                    title="Copy link"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium mb-3">Tags</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
