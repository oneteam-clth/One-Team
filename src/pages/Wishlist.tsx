import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProducts } from "@/hooks/useProducts";

function categoryFallback(categorySlug: string): string {
  if (categorySlug === "hoodies") return "/products/hoodie-red-1.jpg";
  if (categorySlug === "buzos") return "/products/sweatshirt-white-1.jpg";
  if (categorySlug === "gorras") return "/products/cap-black-1.jpg";
  return "/products/tshirt-navy-1.jpg";
}

const Wishlist = () => {
  const { items: wishIds } = useWishlist(); // array de slugs/ids
  const { data: dbProducts = [], isLoading } = useProducts();

  const mapped = dbProducts
    .filter((p: any) => wishIds.includes(p.slug))
    .map((p: any) => {
      const imgs: string[] = Array.isArray(p.product_images)
        ? p.product_images.map((img: any) => img.url).filter(Boolean)
        : [];
      const preferred = imgs.find((u) => typeof u === 'string' && u.includes('/products/'))
        || categoryFallback(p.category?.slug ?? "remeras");

      return {
        product: {
          id: p.slug,
          title: p.title,
          slug: p.slug,
          description: p.description ?? "",
          collectionId: p.collection?.slug ?? "",
          categoryId: p.category?.slug ?? "",
          images: [preferred, preferred],
          createdAt: p.created_at,
        },
        variants: (p.variants || []).map((v: any) => ({
          id: v.id,
          productId: p.slug,
          color: v.color,
          size: v.size,
          sku: v.sku,
          price: Number(v.price),
          salePrice: v.sale_price ? Number(v.sale_price) : null,
          stock: v.stock,
        })),
      };
    });

  if (isLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Cargando favoritos…</p>
      </div>
    );
  }

  if (mapped.length === 0) {
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
          {mapped.map(({ product, variants }) => (
            <ProductCard
              key={product.id}
              product={product}
              variants={variants}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
