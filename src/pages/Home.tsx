import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, RefreshCw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import { products, variants, collections } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import heroImage from "@/assets/hero-main.jpg";
import lookbookImage from "@/assets/lookbook-1.jpg";

function categoryFallback(categorySlug: string): string {
  if (categorySlug === "hoodies") return "/products/hoodie-red-1.jpg";
  if (categorySlug === "buzos") return "/products/sweatshirt-white-1.jpg";
  if (categorySlug === "gorras") return "/products/cap-black-1.jpg";
  return "/products/tshirt-navy-1.jpg";
}

const Home = () => {
  const { data: dbProducts = [], isLoading } = useProducts();
 
  const featuredProducts = dbProducts.slice(0, 4).map((p: any) => {
    const imgs: string[] = Array.isArray(p.product_images)
      ? p.product_images.map((img: any) => img.url).filter(Boolean)
      : [];
    const preferred = imgs.find((u) => typeof u === 'string' && u.includes('/products/'))
      || categoryFallback(p.category?.slug ?? "remeras");

    return {
      id: p.slug, // usamos slug como id interno para mantener rutas existentes
      title: p.title,
      slug: p.slug,
      description: p.description ?? "",
      collectionId: p.collection?.slug ?? "",
      categoryId: p.category?.slug ?? "",
      images: [preferred, preferred],
      createdAt: p.created_at,
    };
  });

  const featuredVariantsMap: Record<string, any[]> = Object.fromEntries(
    dbProducts.slice(0, 4).map((p: any) => [
      p.slug,
      (p.variants || []).map((v: any) => ({
        id: v.id,
        productId: p.slug,
        color: v.color,
        size: v.size,
        sku: v.sku,
        price: Number(v.price),
        salePrice: v.sale_price ? Number(v.sale_price) : null,
        stock: v.stock,
      })),
    ])
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={heroImage}
          alt="One Team Collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center text-white">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
              Básicos que se sienten equipo
            </h1>
            <p className="mb-8 text-xl md:text-2xl">
              Esenciales atemporales desde 2014
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/shop">
                <Button size="lg" variant="default" className="w-full sm:w-auto">
                  Comprar ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/collections/core-basics">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Ver Core Basics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container px-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando destacados…</p>
          ) : (
            <>
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold">Destacados</h2>
                <p className="text-muted-foreground">
                  Nuestra selección de esenciales para vos
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variants={featuredVariantsMap[product.id] || []}
                  />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link to="/shop">
                  <Button size="lg" variant="outline">
                    Ver toda la tienda
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Collections */}
      <section className="bg-muted py-16">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Nuestras Colecciones</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center transition-transform group-hover:scale-105">
                    <h3 className="mb-2 text-3xl font-bold">{collection.name}</h3>
                    <p className="mb-4 text-muted-foreground">{collection.description}</p>
                    <Button variant="outline">
                      Explorar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold">One Team</h2>
              <p className="mb-4 text-lg text-muted-foreground">
                Diseñamos esenciales atemporales con foco en calidad y detalles sutiles.
                Desde 2014, creamos prendas que combinan estilo deportivo con versatilidad urbana.
              </p>
              <p className="mb-6 text-lg text-muted-foreground">
                Dos líneas que definen nuestra identidad: Core Basics para tus esenciales del día a día,
                y Since 2014 celebrando nuestra trayectoria con piezas especiales.
              </p>
              <Link to="/about">
                <Button variant="outline">
                  Conocé más sobre nosotros
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={lookbookImage}
                alt="One Team Lookbook"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-y bg-background py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Envíos a todo el país</h3>
              <p className="text-sm text-muted-foreground">
                Recibí tu pedido en 2-7 días hábiles
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Cambios y devoluciones</h3>
              <p className="text-sm text-muted-foreground">
                30 días para cambios sin cargo
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Calidad garantizada</h3>
              <p className="text-sm text-muted-foreground">
                90 días de garantía en defectos de fábrica
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
