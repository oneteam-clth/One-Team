import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const mpAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log('[mp-webhook] Webhook recibido:', JSON.stringify(body));

    // Mercado Pago sends different types of notifications
    if (body.type === 'payment') {
      const paymentId = body.data?.id;

      if (!paymentId) {
        console.warn('[mp-webhook] No payment ID found');
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get payment details from Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${mpAccessToken}`,
        },
      });

      if (!mpResponse.ok) {
        throw new Error(`Error al obtener pago de MP: ${mpResponse.status}`);
      }

      const payment = await mpResponse.json();
      console.log('[mp-webhook] Payment status:', payment.status);
      console.log('[mp-webhook] External reference:', payment.external_reference);

      const orderId = payment.external_reference;

      if (!orderId) {
        console.warn('[mp-webhook] No order ID in external_reference');
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update order based on payment status
      let paymentStatus: string;
      let fulfillmentStatus: string | undefined;

      switch (payment.status) {
        case 'approved':
          paymentStatus = 'PAID';
          fulfillmentStatus = 'UNFULFILLED';

          // Get order items to decrement stock
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('variant_id, qty')
            .eq('order_id', orderId);

          if (orderItems) {
            for (const item of orderItems) {
              // Decrement stock
              const { data: variant } = await supabase
                .from('variants')
                .select('stock')
                .eq('id', item.variant_id)
                .single();

              if (variant) {
                const newStock = Math.max(0, variant.stock - item.qty);
                await supabase
                  .from('variants')
                  .update({ stock: newStock })
                  .eq('id', item.variant_id);
              }
            }
          }
          break;

        case 'pending':
        case 'in_process':
          paymentStatus = 'PENDING';
          break;

        case 'rejected':
        case 'cancelled':
          paymentStatus = 'FAILED';
          break;

        case 'refunded':
        case 'charged_back':
          paymentStatus = 'REFUNDED';
          // TODO: Restore stock
          break;

        default:
          paymentStatus = 'PENDING';
      }

      const updateData: any = { payment_status: paymentStatus };
      if (fulfillmentStatus) {
        updateData.status = fulfillmentStatus;
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (updateError) {
        console.error('[mp-webhook] Error updating order:', updateError);
        throw updateError;
      }

      console.log(`[mp-webhook] Order ${orderId} updated: ${paymentStatus}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[mp-webhook] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    // Always return 200 to MP to avoid retries
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
