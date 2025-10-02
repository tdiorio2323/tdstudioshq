# Stripe Integration Setup

## What's Been Set Up

✅ **API Endpoints** (Vercel serverless functions):
- `/api/webhook.ts` - Receives Stripe webhook events
- `/api/create-checkout-session.ts` - Creates checkout sessions

✅ **React Components**:
- `CheckoutButton.tsx` - Initiates Stripe Checkout
- `Success.tsx` - Payment success page
- `Cancel.tsx` - Payment canceled page

✅ **Routes**:
- `/success` - Redirects here after successful payment
- `/cancel` - Redirects here if payment is canceled

## Environment Variables

Your `.env` file is configured with:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_b382674f160b700bb556052a25f4317f705314d35c2c3f6dd23c36195bd8232c
```

⚠️ **NOTE**: You're currently using **LIVE keys**. For testing, get TEST keys from:
https://dashboard.stripe.com/test/apikeys

## How to Test Locally

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Start Stripe Webhook Listener (already running)
```bash
stripe listen --forward-to localhost:5173/api/webhook
```

### 3. Use the CheckoutButton Component

In your shop/checkout component, import and use:

```tsx
import CheckoutButton from '@/components/CheckoutButton';

// In your component:
<CheckoutButton
  items={cartItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  }))}
  customerEmail="customer@example.com"
/>
```

### 4. Test with Stripe Test Cards

When using TEST keys, use these cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Any future expiry date, any CVC, any ZIP.

## What Happens During Checkout

1. User clicks "Proceed to Checkout"
2. App calls `/api/create-checkout-session`
3. Stripe creates a session and returns session ID
4. Browser redirects to Stripe Hosted Checkout
5. User enters payment info
6. On success → redirects to `/success`
7. On cancel → redirects to `/cancel`
8. Stripe sends webhook to `/api/webhook` with event details

## Webhook Events You'll Receive

- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment processed
- `payment_intent.payment_failed` - Payment failed

## Production Deployment

When deploying to Vercel:

1. **Add environment variables** in Vercel dashboard:
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` (get from Stripe Dashboard webhook)

2. **Create production webhook** in Stripe Dashboard:
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://tdstudioshq.com/api/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.*`
   - Copy webhook signing secret to Vercel env vars

3. **Update success/cancel URLs** in `create-checkout-session.ts`:
   ```ts
   success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
   cancel_url: `${req.headers.origin}/shop`,
   ```
   These use `req.headers.origin` so they work in both dev and production.

## Next Steps

1. Replace your current checkout flow with `CheckoutButton`
2. Test with Stripe test cards
3. Customize success/cancel pages
4. Add order fulfillment logic in webhook handler
