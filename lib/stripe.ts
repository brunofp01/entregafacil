import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia' as any, // Using latest stable target
});

export const createCheckoutSession = async (priceId: string, customerEmail: string) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Add 'pix' if Brazil is primary
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
    customer_email: customerEmail,
  });

  return session;
};
