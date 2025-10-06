import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, itemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const discountAmount = useMemo(() => {
    if (appliedCoupon === "ONE10") return Math.round(total * 0.1);
    return 0;
  }, [appliedCoupon, total]);

  const grandTotal = useMemo(() => Math.max(total - discountAmount, 0), [total, discountAmount]);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (code === "ONE10") {
      setAppliedCoupon(code);
      setError(null);
    } else {
      setAppliedCoupon(null);
      setError("Cupón inválido");
    }
  };

  const pay = async () => {
    if (!user) {
      setError("Necesitás iniciar sesión para pagar");
      return;
    }
    if (items.length === 0) {
      setError("Tu carrito está vacío");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-preference", {
        body: { userId: user.id },
      });

      if (fnError || !data?.init_point) {
        throw new Error(fnError?.message || "No se pudo iniciar el pago");
      }

      window.location.href = data.init_point;
    } catch (e: any) {
      setError(e?.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !user || items.length === 0;

  return (
    <div className="container px-4 py-12">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Serás redirigido a Mercado Pago para finalizar tu compra.
      </p>

      {/* Guards */}
      {!user && (
        <div className="mt-4 rounded-md border bg-muted/30 p-4 text-sm">
          <p className="mb-2">Para continuar, iniciá sesión.</p>
          <Link to="/auth">
            <Button variant="outline">Ir a iniciar sesión</Button>
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-6 rounded-md border bg-muted/30 p-4 text-sm">
          <p className="mb-2">Tu carrito está vacío.</p>
          <Link to="/shop">
            <Button variant="outline">Ir a la tienda</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Summary */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Resumen de compra</h2>
            <div className="divide-y rounded-md border">
              {items.map((it) => (
                <div key={it.variantId} className="flex items-center gap-4 p-4">
                  <img src={it.image} alt={it.title} className="h-16 w-16 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{it.title}</p>
                    <p className="text-xs text-muted-foreground">{it.color} · {it.size}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">${(it.price * it.quantity).toLocaleString("es-AR")}</p>
                    <p className="text-xs text-muted-foreground">{it.quantity} x ${it.price.toLocaleString("es-AR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals/Action */}
          <div>
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-lg font-semibold">Total</h3>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Productos ({itemCount})</span>
                <span>${total.toLocaleString("es-AR")}</span>
              </div>

              {/* Coupon */}
              <div className="my-4 space-y-2">
                <label className="text-sm font-medium">Cupón</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ingresá tu cupón (p. ej. ONE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyCoupon}>Aplicar</Button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-green-600">Cupón {appliedCoupon} aplicado</p>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="mb-1 flex items-center justify-between text-sm text-green-700">
                  <span>Descuento</span>
                  <span>- ${discountAmount.toLocaleString("es-AR")}</span>
                </div>
              )}

              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Envío</span>
                <span>A calcular</span>
              </div>

              <div className="my-4 h-px bg-border" />

              <div className="mb-2 flex items-center justify-between text-lg font-bold">
                <span>Total a pagar</span>
                <span>${grandTotal.toLocaleString("es-AR")}</span>
              </div>

              {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

              <Button
                className="w-full"
                onClick={pay}
                disabled={isDisabled}
                aria-busy={loading}
              >
                {loading ? "Creando orden…" : "Pagar con Mercado Pago"}
              </Button>

              <p className="mt-3 text-xs text-muted-foreground">
                Al continuar aceptás nuestros términos y políticas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}