import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, Variant } from "@/types/product";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  variants: Variant[];
}

const ProductCard = ({ product, variants }: ProductCardProps) => {
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);

  const defaultVariant = variants.find((v) => v.size === "M" || v.size === "U") || variants[0];
  const hasDiscount = defaultVariant?.salePrice;
  const displayPrice = defaultVariant?.salePrice || defaultVariant?.price || 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Eliminado de favoritos");
    } else {
      addToWishlist(product.id);
      toast.success("Agregado a favoritos");
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (defaultVariant) {
      addToCart({
        variantId: defaultVariant.id,
        productId: product.id,
        quantity: 1,
        title: product.title,
        color: defaultVariant.color,
        size: defaultVariant.size,
        price: defaultVariant.salePrice || defaultVariant.price,
        image: product.images[0],
      });
      toast.success("Agregado al carrito");
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {hasDiscount && (
          <Badge className="absolute left-3 top-3 bg-primary">
            -{Math.round((1 - displayPrice / defaultVariant!.price) * 100)}%
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handleWishlist}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? "fill-primary text-primary" : ""}`} />
        </Button>

        <Button
          variant="default"
          size="sm"
          className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
          onClick={handleQuickAdd}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="font-medium">{product.title}</h3>
        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${defaultVariant?.price.toLocaleString("es-AR")}
            </span>
          )}
          <span className={`font-semibold ${hasDiscount ? "text-primary" : ""}`}>
            ${displayPrice.toLocaleString("es-AR")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
