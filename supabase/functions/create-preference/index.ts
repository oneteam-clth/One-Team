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

    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('No autenticado');
    }

    console.log(`[create-preference] Usuario: ${user.id}`);

    // Get active cart
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select(`
        id,
        cart_items (
          id,
          qty,
          variant:variants (
            id,
            sku,
            price,
            sale_price,
            product:products (
              id,
              title
            )
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .single();

    if (cartError || !cart || !cart.cart_items || cart.cart_items.length === 0) {
      throw new Error('Carrito vacío');
    }

    console.log(`[create-preference] Carrito con ${cart.cart_items.length} items`);

    // Calculate totals
    let subtotal = 0;
    const items = cart.cart_items.map((item: any) => {
      const variant = item.variant;
      const price = Number(variant.sale_price || variant.price);
      const lineTotal = price * item.qty;
      subtotal += lineTotal;

      return {
        variantId: variant.id,
        title: variant.product.title,
        variantJson: { sku: variant.sku },
        unitPrice: price,
        qty: item.qty,
        lineTotal,
      };
    });

    const shipping = 0; // Calculate based on shipping method if needed
    const tax = 0;
    const total = subtotal + shipping + tax;

    console.log(`[create-preference] Subtotal: ${subtotal}, Total: ${total}`);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        contact_email: user.email,
        subtotal,
        shipping,
        tax,
        total,
        payment_provider: 'MERCADOPAGO',
        status: 'UNFULFILLED',
        payment_status: 'PENDING',
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error('Error al crear orden');
    }

    console.log(`[create-preference] Orden creada: ${order.id}`);

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      variant_id: item.variantId,
      title: item.title,
      variant_json: item.variantJson,
      unit_price: item.unitPrice,
      qty: item.qty,
      line_total: item.lineTotal,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error('Error al crear items de orden');
    }

    // Create Mercado Pago preference
    const mpItems = items.map((item: any) => ({
      title: item.title,
      quantity: item.qty,
      unit_price: item.unitPrice,
      currency_id: 'ARS',
    }));

    const preferenceData = {
      items: mpItems,
      back_urls: {
        success: `${req.headers.get('origin')}/checkout/success?order=${order.id}`,
        failure: `${req.headers.get('origin')}/checkout/failure`,
        pending: `${req.headers.get('origin')}/checkout/pending`,
      },
      auto_return: 'approved',
      external_reference: order.id,
      notification_url: `${supabaseUrl}/functions/v1/mp-webhook`,
    };

    console.log('[create-preference] Creando preference en Mercado Pago...');

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error('[create-preference] Error MP:', errorText);
      throw new Error(`Error de Mercado Pago: ${mpResponse.status}`);
    }

    const mpData = await mpResponse.json();
    console.log(`[create-preference] Preference creada: ${mpData.id}`);

    // Update order with MP preference ID
    await supabase
      .from('orders')
      .update({ provider_payment_id: mpData.id })
      .eq('id', order.id);

    return new Response(
      JSON.stringify({
        init_point: mpData.init_point,
        orderId: order.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[create-preference] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
