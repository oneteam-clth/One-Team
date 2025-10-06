import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart, Truck, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SizeGuide from "@/components/SizeGuide";
import ProductCard from "@/components/ProductCard";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: p, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const { isInWishlist, addItem: addWish, removeItem: removeWish } = useWishlist();
  const [variantId, setVariantId] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) return (
    <div className="container px-4 py-8">
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground">Cargando producto…</p>
      </div>
    </div>
  );

  if (!p) return (
    <div className="container px-4 py-8">
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Producto no encontrado</h1>
          <p className="mb-6 text-muted-foreground">
            El producto que buscas no existe o fue removido
          </p>
          <Link to="/shop">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  const product = {
    id: p.slug,
    title: p.title,
    slug: p.slug,
    description: p.description ?? "",
    collectionId: p.collection?.slug ?? "",
    categoryId: p.category?.slug ?? "",
    images: (p.product_images?.length ? p.product_images.map((img: any) => img.url) : ["/brand/one-team-logo-color.png"]).slice(0,2),
    createdAt: p.created_at,
  };

  const variants = (p.variants || []).map((v: any) => ({
    id: v.id,
    productId: p.slug,
    color: v.color,
    size: v.size,
    sku: v.sku,
    price: Number(v.price),
    salePrice: v.sale_price ? Number(v.sale_price) : null,
    stock: v.stock,
  }));

  const defaultVariantId = variants[0]?.id;
  const selected = variants.find(v => v.id === (variantId || defaultVariantId));
  const inStock = (selected?.stock ?? 0) > 0;

  const toggleWishlist = () => {
    const inWL = isInWishlist(product.id);
    if (inWL) {
      removeWish(product.id);
      toast.success("Removido de la lista de deseos");
    } else {
      addWish(product.id);
      toast.success("Agregado a la lista de deseos");
    }
  };

  const addToCart = () => {
    if (!selected) {
      toast.error("Seleccioná una variante");
      return;
    }
    addItem({
      variantId: selected.id,
      productId: product.id,
      quantity: 1,
      title: product.title,
      color: selected.color,
      size: selected.size,
      price: selected.salePrice || selected.price,
      image: product.images[0],
    });
    toast.success("Agregado al carrito");
  };

  // Productos relacionados
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((prod: any) => prod.slug !== product.id && prod.category?.slug === product.categoryId)
      .slice(0, 4)
      .map((prod: any) => ({
        id: prod.slug,
        title: prod.title,
        slug: prod.slug,
        description: prod.description ?? "",
        collectionId: prod.collection?.slug ?? "",
        categoryId: prod.category?.slug ?? "",
        images: (prod.product_images?.length ? prod.product_images.map((img: any) => img.url) : ["/brand/one-team-logo-color.png"]).slice(0,2),
        createdAt: prod.created_at,
      }));
  }, [allProducts, product.id, product.categoryId]);

  const relatedVariants = useMemo(() => {
    return Object.fromEntries(
      relatedProducts.map((prod) => [
        prod.id,
        allProducts
          .find((p: any) => p.slug === prod.id)
          ?.variants?.map((v: any) => ({
            id: v.id,
            productId: prod.id,
            color: v.color,
            size: v.size,
            sku: v.sku,
            price: Number(v.price),
            salePrice: v.sale_price ? Number(v.sale_price) : null,
            stock: v.stock,
          })) || []
      ])
    );
  }, [relatedProducts, allProducts]);

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">
            ← Volver a la tienda
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.images[selectedImageIndex] || "/brand/one-team-logo-color.png"}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded border ${
                      selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="mt-2 flex items-center gap-3">
                {selected?.salePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${selected.price.toLocaleString("es-AR")}
                  </span>
                )}
                <span className="text-2xl font-semibold">
                  ${(selected?.salePrice || selected?.price)?.toLocaleString("es-AR")}
                </span>
                {selected?.salePrice && (
                  <Badge variant="destructive">
                    Oferta
                  </Badge>
                )}
              </div>
            </div>

            {/* Variant Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Variante</label>
                <select 
                  className="mt-1 w-full rounded border px-3 py-2" 
                  value={variantId || defaultVariantId} 
                  onChange={e => setVariantId(e.target.value)}
                >
                  {variants.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.color} — {v.size}
                    </option>
                  ))}
                </select>
              </div>

              {!inStock && (
                <p className="text-sm text-destructive">Sin stock</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                disabled={!inStock} 
                onClick={addToCart}
                className="flex-1"
              >
                Agregar al carrito
              </Button>
              <Button 
                variant="outline" 
                onClick={toggleWishlist}
                className="px-3"
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>Envío a todo el país</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span>Cambios sin cargo</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>Calidad One Team</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Size Guide */}
            <div>
              <SizeGuide 
                category={product.categoryId} 
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">También te puede gustar</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  variants={relatedVariants[relatedProduct.id] || []}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}