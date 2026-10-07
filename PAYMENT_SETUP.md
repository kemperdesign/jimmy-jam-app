# Payment Processing Setup Guide

This guide explains how to set up payment processing for the Jimmy Jam app using Stripe.

## Current Implementation

Payment processing is partially implemented in the frontend:
- Ticket purchase form (`src/JimmyJamApp.jsx`)
- Merchandise order tracking (ready for implementation)
- Donation capability (ready for implementation)
- Payment data storage in Supabase (`submitTicketOrder`, `submitMerchOrder`, `submitDonation`)
- Order email confirmations via integrated email system

The frontend is ready to accept payment information, but requires a secure backend to complete Stripe integration.

## Stripe Setup

### 1. Create Stripe Account

1. Sign up at https://stripe.com
2. Verify your email and complete account setup
3. Get your API keys from Dashboard → Developers → API Keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`) - Keep this secret!

### 2. Install Stripe Package

Already installed in `package.json`:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Frontend Configuration

### Add Environment Variables

Create `.env.local` in the project root:
```
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

Never commit your secret key to version control - it must stay on the backend only.

## Backend Integration (Required)

The frontend payment form is ready to accept card information, but the actual payment processing must be handled by a secure backend. Here's how to complete it:

### Option 1: Supabase Edge Functions (Recommended)

Create a new Edge Function to handle Stripe payments:

```bash
supabase functions new process-payment
```

Implement in `supabase/functions/process-payment/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  try {
    const { amount, currency, email, orderType, orderId } = await req.json();

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        orderType,
        orderId,
        email,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### Option 2: Express Backend

If using a Node.js/Express backend:

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, email, orderType, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderType,
        orderId,
        email,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Option 3: Other Backend Platforms

- **Firebase Cloud Functions**: Similar to Supabase Edge Functions
- **AWS Lambda**: Set up payment intent creation endpoint
- **Netlify Functions**: Serverless functions for payment handling
- **Vercel**: API routes for payment processing

## Frontend Payment Flow

Update `handleTicketPayment` in `src/JimmyJamApp.jsx`:

```javascript
const handleTicketPayment = async (e) => {
  e.preventDefault();
  setPaymentProcessing(true);
  setPaymentError('');

  try {
    const amount = ticketPrices[selectedTicketType] * ticketQuantity;

    // 1. Create order in Supabase
    const { data: orderData, error: orderError } = await submitTicketOrder({
      name: paymentForm.name,
      email: paymentForm.email,
      phone: paymentForm.phone,
      ticketType: selectedTicketType,
      quantity: ticketQuantity,
      amount: amount
    });

    if (orderError) throw orderError;

    // 2. Get payment intent from backend
    const paymentResponse = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        email: paymentForm.email,
        orderType: 'tickets',
        orderId: orderData[0].id,
      }),
    });

    const { clientSecret } = await paymentResponse.json();

    // 3. Use Stripe Elements to confirm payment
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement, // Stripe Card Element reference
        billing_details: {
          name: paymentForm.name,
          email: paymentForm.email,
        },
      },
    });

    if (paymentIntent.status === 'succeeded') {
      // 4. Update order status
      await updateOrderStatus(orderData[0].id, 'completed', paymentIntent.id);

      // 5. Send confirmation email
      await sendEmail(paymentForm.email, 'ticketConfirmation', {
        name: paymentForm.name,
        ticketType: selectedTicketType,
        quantity: ticketQuantity,
        amount: amount,
        orderId: orderData[0].id,
      });

      setPaymentSuccess(true);
      setPaymentForm({ name: '', email: '', phone: '', cardNumber: '', expiryDate: '', cvc: '' });
    }
  } catch (error) {
    setPaymentError('Payment failed: ' + error.message);
  } finally {
    setPaymentProcessing(false);
  }
};
```

## Adding Stripe Elements to UI

Import and use Stripe Elements for secure card input:

```javascript
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// In your payment form:
<CardElement
  options={{
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': { color: '#aab7c4' },
      },
      invalid: { color: '#9e2146' },
    },
  }}
/>
```

## Database Schema

Ensure your Supabase `orders` table has these columns:

```sql
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_type VARCHAR(50),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  ticket_type VARCHAR(50),
  quantity INTEGER,
  items JSONB,
  amount DECIMAL(10, 2),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  submitted_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Security Considerations

✅ **Do's**:
- Store payment intent IDs in Supabase
- Keep Stripe secret key on backend only
- Use HTTPS for all payment requests
- Implement webhook handlers for payment completion
- Store customer payment method tokens (not raw card data)

❌ **Don'ts**:
- Never send credit card data to frontend
- Never commit API keys to version control
- Never store raw credit card numbers
- Never make Stripe API calls from frontend

## Webhook Handling

Handle Stripe webhooks to confirm payments:

```javascript
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { orderId } = paymentIntent.metadata;
    
    // Update order status in Supabase
    await updateOrderStatus(orderId, 'completed', paymentIntent.id);
  }

  res.json({ received: true });
});
```

## Testing

### Test Card Numbers

Use these Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires 3D Secure**: 4000 0025 0000 3155

Any future date and any 3-digit CVC

## Email Confirmations

Payment confirmation emails are sent automatically via `sendEmail()` after successful payment. Configure your email service:
- Resend: See EMAIL_SETUP.md
- SendGrid: See EMAIL_SETUP.md
- Other providers: Configure in `src/supabaseClient.js`

## Production Deployment

1. **Switch from Test to Live Keys**
   - Replace `pk_test_*` with `pk_live_*` in production env
   - Replace `sk_test_*` with `sk_live_*` in backend

2. **Enable Webhook**
   - Add webhook endpoint in Stripe Dashboard
   - Point to your production server

3. **SSL/TLS Certificate**
   - Ensure HTTPS is enabled
   - Use valid SSL certificate

4. **PCI Compliance**
   - Use Stripe Elements for PCI compliance
   - Don't store raw card data

## Troubleshooting

**"Invalid API Key"**
- Check that your Stripe keys are correct
- Ensure test mode matches (both test or both live)

**"Declined Card"**
- Use valid test card numbers
- Check card expiry date

**"Payment Intent not found"**
- Verify order creation succeeded before creating payment intent
- Check that payment intent ID matches in webhook

**"CORS Error"**
- Ensure backend has proper CORS headers
- Allow requests from your frontend domain

## Next Steps

1. Set up Stripe account and get API keys
2. Choose backend option (Edge Functions, Express, etc.)
3. Implement payment intent creation
4. Add Stripe Elements to payment form
5. Test with test card numbers
6. Deploy to production
7. Monitor transactions in Stripe Dashboard

## Support

For Stripe documentation: https://stripe.com/docs
For Supabase Edge Functions: https://supabase.com/docs/guides/functions
