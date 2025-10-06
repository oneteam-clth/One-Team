import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="mb-6 text-muted-foreground">
            Descubrí nuestros productos y empezá a agregar
          </p>
          <Link to="/shop">
            <Button size="lg">Ir a la tienda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Carrito</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 rounded-lg border p-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.color} / {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toLocaleString("es-AR")}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-bold">Resumen</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium">A calcular</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toLocaleString("es-AR")}</span>
              </div>

              <Button size="lg" className="w-full mb-3">
                Finalizar compra
              </Button>
              
              <Link to="/shop">
                <Button variant="outline" size="lg" className="w-full">
                  Seguir comprando
                </Button>
              </Link>

              <div className="mt-6 space-y-2 text-xs text-muted-foreground">
                <p>• Envío a todo el país</p>
                <p>• Pago seguro con Mercado Pago</p>
                <p>• Cambios y devoluciones sin cargo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
