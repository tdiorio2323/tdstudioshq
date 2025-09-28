import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, MapPin, Clock, CheckCircle } from "lucide-react";
import { DELIVERY_FEE_CENTS } from "@/lib/config";
import { toDollars, fmt } from "@/lib/money";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  image?: string;
  thc_percentage: number | null;
  category: string;
}

interface CheckoutFlowProps {
  cartItems: CartItem[];
  total: number;
  onBack: () => void;
  onOrderComplete: () => void;
}

export const CheckoutFlow = ({ cartItems, total, onBack, onOrderComplete }: CheckoutFlowProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    notes: ""
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const deliveryFeeCents = DELIVERY_FEE_CENTS;
  const deliveryFee = toDollars(deliveryFeeCents);
  const taxCents = Math.round(total * 0.08875 * 100);
  const finalTotal = toDollars(total * 100 + deliveryFeeCents + taxCents);

  // Optimized handlers to prevent INP issues
  const updateDeliveryInfo = useCallback((field: keyof typeof deliveryInfo, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const updatePaymentInfo = useCallback((field: keyof typeof paymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    // Simulate processing
    setTimeout(() => {
      if (onOrderComplete) {
        onOrderComplete();
      } else {
        // Clear cart data and navigate to shop
        sessionStorage.removeItem('cartItems');
        sessionStorage.removeItem('cartTotal');
        navigate('/shop');
      }
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold text-primary">Order Confirmed!</h2>
            <p className="text-muted-foreground">
              Your order will be delivered in 3-5 working business days
            </p>
            <Badge variant="secondary" className="text-sm">
              Order #12345
            </Badge>
            <Button onClick={onOrderComplete} className="w-full mt-4">
              Track Order
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/shop')} 
              className="w-full mt-2"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-50">
        <div className="flex items-center gap-3">
          {onBack ? (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/shop')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>
        
        {/* Brand Logo */}
        <div className="flex justify-center mt-4 mb-6">
          <img 
            src="/td-studios-chrome-metal-logo.png" 
            alt="Brand Logo" 
            className="h-9 w-auto"
          />
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <span className="text-sm">Delivery</span>
          </div>
          <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <span className="text-sm">Payment</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {(item.image_url || item.image) ? (
                      <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      {item.thc_percentage && (
                        <Badge variant="secondary" className="text-xs">
                          {item.thc_percentage}% THC
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{fmt(item.price)}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{fmt(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{fmt(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{fmt(toDollars(taxCents))}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span>{fmt(finalTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    value={deliveryInfo.address}
                    onChange={(e) => updateDeliveryInfo('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={deliveryInfo.city}
                      onChange={(e) => updateDeliveryInfo('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="ZIP"
                      value={deliveryInfo.zipCode}
                      onChange={(e) => updateDeliveryInfo('zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={deliveryInfo.phone}
                    onChange={(e) => updateDeliveryInfo('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="e.g., Leave at door, Ring doorbell"
                    value={deliveryInfo.notes}
                    onChange={(e) => updateDeliveryInfo('notes', e.target.value)}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Estimated Delivery Time</p>
                    <p className="text-sm text-muted-foreground">3-5 working business days</p>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => updatePaymentInfo('cardNumber', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => updatePaymentInfo('expiryDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={(e) => updatePaymentInfo('cvv', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    placeholder="John Doe"
                    value={paymentInfo.nameOnCard}
                    onChange={(e) => updatePaymentInfo('nameOnCard', e.target.value)}
                    required
                  />
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm font-medium text-primary">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure.</p>
                </div>

                <Button type="submit" className="w-full">
                  Place Order - {fmt(finalTotal)}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};