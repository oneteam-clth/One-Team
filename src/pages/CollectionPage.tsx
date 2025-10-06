import { useParams, Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products, variants, collections } from "@/data/products";
import { ArrowLeft } from "lucide-react";

const CollectionPage = () => {
  const { slug } = useParams();
  const collection = collections.find((c) => c.slug === slug);
  const collectionProducts = collection
    ? products.filter((p) => p.collectionId === collection.id)
    : [];

  if (!collection) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Colección no encontrada</h1>
          <Link to="/shop">
            <Button>Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        <Link to="/shop">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="text-lg text-muted-foreground">{collection.description}</p>
          )}
        </div>

        {collectionProducts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No hay productos disponibles en esta colección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collectionProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variants={variants.filter((v) => v.productId === product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
