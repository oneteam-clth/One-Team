import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SizeGuide from "@/components/SizeGuide";
import ProductCard from "@/components/ProductCard";
import { products, variants } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const productVariants = product ? variants.filter((v) => v.productId === product.id) : [];

  const [selectedColor, setSelectedColor] = useState(productVariants[0]?.color || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();

  if (!product) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Producto no encontrado</h1>
          <Link to="/shop">
            <Button>Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const availableColors = [...new Set(productVariants.map((v) => v.color))];
  const availableSizes = [...new Set(
    productVariants.filter((v) => v.color === selectedColor).map((v) => v.size)
  )];

  const selectedVariant = productVariants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor seleccioná un talle");
      return;
    }
    if (!selectedVariant) {
      toast.error("Variante no disponible");
      return;
    }
    if (selectedVariant.stock < quantity) {
      toast.error("No hay suficiente stock disponible");
      return;
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      quantity,
      title: product.title,
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: selectedVariant.salePrice || selectedVariant.price,
      image: product.images[0],
    });

    toast.success("Producto agregado al carrito");
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Eliminado de favoritos");
    } else {
      addToWishlist(product.id);
      toast.success("Agregado a favoritos");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Inicio</Link>
          {" / "}
          <Link to="/shop" className="hover:text-foreground">Tienda</Link>
          {" / "}
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-3">
                {selectedVariant?.salePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${selectedVariant.price.toLocaleString("es-AR")}
                  </span>
                )}
                <span className={`text-2xl font-bold ${selectedVariant?.salePrice ? "text-primary" : ""}`}>
                  ${(selectedVariant?.salePrice || selectedVariant?.price || 0).toLocaleString("es-AR")}
                </span>
                {selectedVariant?.salePrice && (
                  <Badge variant="destructive">
                    -{Math.round((1 - selectedVariant.salePrice / selectedVariant.price) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Color */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium">Color: {selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize("");
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium">Talle{selectedSize && `: ${selectedSize}`}</span>
                <SizeGuide category={product.categoryId} />
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const variant = productVariants.find(
                    (v) => v.color === selectedColor && v.size === size
                  );
                  const isOutOfStock = !variant || variant.stock === 0;
                  
                  return (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      disabled={isOutOfStock}
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <span className="mb-3 block font-medium">Cantidad</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!selectedVariant || quantity >= selectedVariant.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {selectedVariant && (
                  <span className="text-sm text-muted-foreground">
                    {selectedVariant.stock} disponibles
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mb-6 flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                Agregar al carrito
              </Button>
              <Button size="lg" variant="outline" onClick={handleWishlist}>
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 font-semibold">Descripción</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Envío a domicilio</p>
                  <p className="text-muted-foreground">Recibilo en 2-7 días hábiles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Cambios y devoluciones</p>
                  <p className="text-muted-foreground">30 días para cambios sin cargo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">También te puede interesar</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  variants={variants.filter((v) => v.productId === relatedProduct.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
