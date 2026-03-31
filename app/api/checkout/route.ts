import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { amount, email, propertyAddress, standard } = await req.json();

    if (!amount || !email) {
      return NextResponse.json({ error: 'Missing amount or email' }, { status: 400 });
    }

    // Calcular data de cancelamento (12 meses a partir de agora)
    const cancelAt = Math.floor(Date.now() / 1000) + (12 * 30 * 24 * 60 * 60);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Proteção Entrega Facilitada - ${standard.toUpperCase()}`,
              description: `Cobertura para o imóvel: ${propertyAddress}`,
            },
            unit_amount: Math.round(amount * 100), // Valor em centavos
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        cancel_at: cancelAt, // Encerra automaticamente após 12 meses
        metadata: {
          property_address: propertyAddress,
          standard: standard,
        }
      } as any,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/simulate?canceled=true`,
      customer_email: email,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
