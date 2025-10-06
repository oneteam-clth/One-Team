import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { products, variants } from "@/data/products";

const Wishlist = () => {
  const { items } = useWishlist();
  const wishlistProducts = products.filter((p) => items.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Tu lista de favoritos está vacía</h1>
          <p className="mb-6 text-muted-foreground">
            Guardá tus productos favoritos para encontrarlos fácilmente
          </p>
          <Link to="/shop">
            <Button size="lg">Explorar productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Mis Favoritos</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variants={variants.filter((v) => v.productId === product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
