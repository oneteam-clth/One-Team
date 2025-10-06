import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { useCategories } from "@/hooks/useCategories";

function categoryFallback(categorySlug: string): string {
  if (categorySlug === "hoodies") return "/products/hoodie-red-1.jpg";
  if (categorySlug === "buzos") return "/products/sweatshirt-white-1.jpg";
  if (categorySlug === "gorras") return "/products/cap-black-1.jpg";
  return "/products/tshirt-navy-1.jpg"; // remeras u otros
}

export default function Shop() {
  const { data: dbProducts = [], isLoading } = useProducts();
  const { data: dbCollections = [] } = useCollections();
  const { data: dbCategories = [] } = useCategories();

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]); // slugs
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // slugs
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("new");

  const mapped = useMemo(() => dbProducts.map((p: any) => {
    const imgs: string[] = Array.isArray(p.product_images)
      ? p.product_images.map((img: any) => img.url).filter(Boolean)
      : [];
    // Preferimos imágenes de nuestra carpeta /products/, sino caemos a un placeholder por categoría
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
  }), [dbProducts]);

  let filtered = mapped;
  if (selectedCollections.length) {
    filtered = filtered.filter(({ product }) => selectedCollections.includes(product.collectionId));
  }
  if (selectedCategories.length) {
    filtered = filtered.filter(({ product }) => selectedCategories.includes(product.categoryId));
  }
  if (selectedColors.length || selectedSizes.length) {
    filtered = filtered.filter(({ variants }) => variants.some((v: any) =>
      (selectedColors.length ? selectedColors.includes(v.color) : true) &&
      (selectedSizes.length ? selectedSizes.includes(v.size) : true)
    ));
  }

  if (sortBy === "price-asc") filtered = [...filtered].sort((a,b) => (a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0) - (b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a,b) => (b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0) - (a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0));

  const allColors = Array.from(new Set(mapped.flatMap(m => m.variants.map((v: any) => v.color))));
  const allSizes = Array.from(new Set(mapped.flatMap(m => m.variants.map((v: any) => v.size))));

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tienda</h1>
          <p className="text-muted-foreground">
            Encontrá los esenciales perfectos para vos
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px]">
                <div className="space-y-6">
                  {/* Collections */}
                  <div>
                    <h3 className="mb-2 font-semibold">Colecciones</h3>
                    <div className="space-y-2">
                      {dbCollections.map((c: any) => (
                        <label key={c.slug} className="flex items-center gap-2">
                          <Checkbox 
                            checked={selectedCollections.includes(c.slug)} 
                            onCheckedChange={(v) => {
                              setSelectedCollections(prev => 
                                v ? [...prev, c.slug] : prev.filter(x => x !== c.slug)
                              )
                            }} 
                          />
                          <span>{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="mb-2 font-semibold">Categorías</h3>
                    <div className="space-y-2">
                      {dbCategories.map((c: any) => (
                        <label key={c.slug} className="flex items-center gap-2">
                          <Checkbox 
                            checked={selectedCategories.includes(c.slug)} 
                            onCheckedChange={(v) => {
                              setSelectedCategories(prev => 
                                v ? [...prev, c.slug] : prev.filter(x => x !== c.slug)
                              )
                            }} 
                          />
                          <span>{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className="mb-2 font-semibold">Talles</h3>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((s) => (
                        <label key={s} className="flex items-center gap-2">
                          <Checkbox 
                            checked={selectedSizes.includes(s)} 
                            onCheckedChange={(v) => {
                              setSelectedSizes(prev => 
                                v ? [...prev, s] : prev.filter(x => x !== s)
                              )
                            }} 
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h3 className="mb-2 font-semibold">Colores</h3>
                    <div className="flex flex-wrap gap-2">
                      {allColors.map((c) => (
                        <label key={c} className="flex items-center gap-2">
                          <Checkbox 
                            checked={selectedColors.includes(c)} 
                            onCheckedChange={(v) => {
                              setSelectedColors(prev => 
                                v ? [...prev, c] : prev.filter(x => x !== c)
                              )
                            }} 
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Results count */}
            <span className="text-sm text-muted-foreground">
              {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort">Ordenar por:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Más recientes</SelectItem>
                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-muted-foreground">Cargando productos…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">No se encontraron productos</p>
            <p className="text-sm text-muted-foreground">
              Prueba ajustando los filtros o busca algo diferente
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map(({ product, variants }) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variants={variants} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}