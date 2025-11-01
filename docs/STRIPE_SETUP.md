# Stripe Setup Guide

This guide will help you set up Stripe for monetization in Auto Inventor.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your `.env.local` file ready for configuration

## Step 1: Get Your Stripe API Keys

1. Go to Name (required)
Name of the product or service, visible to customers.
Name is required.
Description
Appears at checkout, on the customer portal, and in quotes.
Image
Appears at checkout. JPEG, PNG or WEBP under 2MB.
No file chosen
Upload
More options


Recurring

One-off
Amount (required)

2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Add them to your `.env.local` file:

```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Step 2: Create Products and Prices

### Pro Plan ($9.99/month)

1. Go to https://dashboard.stripe.com/products
2. Click **"+ Add product"**
3. Fill in:
   - **Name**: Auto Inventor Pro
   - **Description**: Unlimited access to all AI tools
   - **Pricing model**: Standard pricing
   - **Price**: $9.99
   - **Billing period**: Monthly
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_`)
6. Add to `.env.local`:

```bash
STRIPE_PRO_PRICE_ID=price_your_pro_price_id_here
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_your_pro_price_id_here
```

### Premium Plan ($19.99/month)

1. Create another product following the same steps
2. Fill in:
   - **Name**: Auto Inventor Premium
   - **Description**: Everything in Pro plus team features
   - **Price**: $19.99
   - **Billing period**: Monthly
3. Copy the **Price ID**
4. Add to `.env.local`:

```bash
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id_here
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id_here
```

## Step 3: Set Base URL

Add your base URL to `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, change this to your actual domain (e.g., `https://autoinventor.com`)

## Step 4: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/pricing

3. Click "Subscribe Now" on the Pro or Premium plan

4. You'll be redirected to Stripe Checkout

5. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC

6. Complete the checkout and verify you're redirected to the success page

## Step 5: Production Setup (Optional)

For production:

1. Switch to **Live mode** in your Stripe dashboard
2. Get your **live API keys** (start with `pk_live_` and `sk_live_`)
3. Update your production environment variables
4. Set up a webhook endpoint for subscription events (optional but recommended)

## Webhook Setup (Advanced - Optional)

To handle subscription cancellations and updates:

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. Set endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Complete .env.local Example

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_PRO_PRICE_ID=price_1...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1...
STRIPE_PREMIUM_PRICE_ID=price_2...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_2...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Features Implemented

✅ Three pricing tiers: Free, Pro, Premium
✅ Stripe Checkout integration
✅ Success page after payment
✅ Upgrade button in navbar
✅ Pricing page with FAQ
✅ Responsive design

## Next Steps (To Implement)

- [ ] Add user authentication (NextAuth.js)
- [ ] Store subscription status in database
- [ ] Implement usage limits based on plan
- [ ] Add webhook handler for subscription events
- [ ] Create customer portal for subscription management

## Support

For Stripe-related issues, consult:
- Stripe Documentation: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing

