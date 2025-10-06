import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products, variants, categories, collections } from "@/data/products";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const categoryFromUrl = searchParams.get("category");

  const sizes = ["XS", "S", "M", "L", "XL", "U"];
  const colors = ["Negro", "Blanco", "Rojo", "Azul Marino"];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // URL category filter
    if (categoryFromUrl) {
      filtered = filtered.filter((p) => p.categoryId === categoryFromUrl);
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.categoryId)
      );
    }

    // Collection filter
    if (selectedCollections.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCollections.includes(p.collectionId)
      );
    }

    // Size & Color filter
    if (selectedSizes.length > 0 || selectedColors.length > 0) {
      filtered = filtered.filter((product) => {
        const productVariants = variants.filter((v) => v.productId === product.id);
        return productVariants.some((v) => {
          const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(v.size);
          const colorMatch = selectedColors.length === 0 || selectedColors.includes(v.color);
          return sizeMatch && colorMatch;
        });
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => {
        const aVariant = variants.find((v) => v.productId === a.id);
        const bVariant = variants.find((v) => v.productId === b.id);
        return (aVariant?.price || 0) - (bVariant?.price || 0);
      });
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => {
        const aVariant = variants.find((v) => v.productId === a.id);
        const bVariant = variants.find((v) => v.productId === b.id);
        return (bVariant?.price || 0) - (aVariant?.price || 0);
      });
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [selectedCategories, selectedCollections, selectedSizes, selectedColors, sortBy, categoryFromUrl]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((c) => c !== collectionId)
        : [...prev, collectionId]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 font-semibold">Categorías</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div>
        <h3 className="mb-3 font-semibold">Colecciones</h3>
        <div className="space-y-2">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center space-x-2">
              <Checkbox
                id={`collection-${collection.id}`}
                checked={selectedCollections.includes(collection.id)}
                onCheckedChange={() => toggleCollection(collection.id)}
              />
              <Label htmlFor={`collection-${collection.id}`} className="cursor-pointer">
                {collection.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="mb-3 font-semibold">Talles</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="mb-3 font-semibold">Colores</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <Label htmlFor={`color-${color}`} className="cursor-pointer">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tienda</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más nuevos</SelectItem>
                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="mt-8">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden w-64 flex-shrink-0 md:block">
            <div className="sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron productos con los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
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
      </div>
    </div>
  );
};

export default Shop;
