import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutButtonProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  customerEmail?: string;
  disabled?: boolean;
}

export default function CheckoutButton({ items, customerEmail, disabled }: CheckoutButtonProps) {
  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { id } = await res.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error('Stripe redirect error:', error);
        toast.error(error.message);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || items.length === 0}
      className="w-full"
    >
      Proceed to Checkout
    </Button>
  );
}
