import { Product, Variant, Collection, Category } from "@/types/product";

export const collections: Collection[] = [
  {
    id: "core-basics",
    name: "Core Basics",
    slug: "core-basics",
    description: "Esenciales atemporales para el día a día"
  },
  {
    id: "since-2014",
    name: "Since 2014",
    slug: "since-2014",
    description: "Piezas que celebran nuestra historia"
  }
];

export const categories: Category[] = [
  { id: "hoodies", name: "Hoodies", slug: "hoodies" },
  { id: "remeras", name: "Remeras", slug: "remeras" },
  { id: "gorras", name: "Gorras", slug: "gorras" },
  { id: "buzos", name: "Buzos", slug: "buzos" }
];

export const products: Product[] = [
  {
    id: "hoodie-essential",
    title: "Hoodie Essential",
    slug: "hoodie-essential",
    description: "Hoodie clásico de algodón premium con bordado OT. Corte regular, capucha ajustable y bolsillo canguro. Ideal para entrenar o el día a día.",
    collectionId: "core-basics",
    categoryId: "hoodies",
    images: ["/products/hoodie-red-1.jpg", "/products/hoodie-red-1.jpg"],
    createdAt: "2024-01-15"
  },
  {
    id: "remera-basica",
    title: "Remera Básica OT",
    slug: "remera-basica",
    description: "Remera de algodón peinado 100%. Fit moderno, cuello redondo reforzado. Logo bordado en pecho. Tu básico de todos los días.",
    collectionId: "core-basics",
    categoryId: "remeras",
    images: ["/products/tshirt-navy-1.jpg", "/products/tshirt-navy-1.jpg"],
    createdAt: "2024-01-20"
  },
  {
    id: "gorra-classic",
    title: "Gorra Classic",
    slug: "gorra-classic",
    description: "Gorra estructurada de 6 paneles. Visera curva, ajuste posterior con hebilla metálica. Bordado frontal en 3D.",
    collectionId: "since-2014",
    categoryId: "gorras",
    images: ["/products/cap-black-1.jpg", "/products/cap-black-1.jpg"],
    createdAt: "2024-02-01"
  },
  {
    id: "buzo-crew",
    title: "Buzo Crew Neck",
    slug: "buzo-crew",
    description: "Buzo de algodón afelpado interior. Cuello redondo con ribbing, puños y cintura elásticos. Bordado tonal en pecho.",
    collectionId: "core-basics",
    categoryId: "buzos",
    images: ["/products/sweatshirt-white-1.jpg", "/products/sweatshirt-white-1.jpg"],
    createdAt: "2024-02-10"
  },
  {
    id: "hoodie-premium",
    title: "Hoodie Premium",
    slug: "hoodie-premium",
    description: "Hoodie premium oversized. Algodón francés de 400gsm, caída amplia, cordones planos. Acabado suave brushed.",
    collectionId: "since-2014",
    categoryId: "hoodies",
    images: ["/products/hoodie-red-1.jpg", "/products/hoodie-red-1.jpg"],
    createdAt: "2024-02-15"
  },
  {
    id: "remera-pocket",
    title: "Remera con Bolsillo",
    slug: "remera-pocket",
    description: "Remera con bolsillo frontal. Algodón de 180gsm, fit relajado, costuras reforzadas. Detalle bordado en bolsillo.",
    collectionId: "core-basics",
    categoryId: "remeras",
    images: ["/products/tshirt-navy-1.jpg", "/products/tshirt-navy-1.jpg"],
    createdAt: "2024-03-01"
  },
  {
    id: "gorra-snapback",
    title: "Gorra Snapback",
    slug: "gorra-snapback",
    description: "Snapback de lana. Estructura plana, visera recta, cierre ajustable. Parche bordado frontal.",
    collectionId: "core-basics",
    categoryId: "gorras",
    images: ["/products/cap-black-1.jpg", "/products/cap-black-1.jpg"],
    createdAt: "2024-03-05"
  },
  {
    id: "buzo-zip",
    title: "Buzo con Cierre",
    slug: "buzo-zip",
    description: "Buzo con cierre completo. Algodón-poliéster, bolsillos laterales, capucha integrada. Logo bordado en espalda.",
    collectionId: "since-2014",
    categoryId: "buzos",
    images: ["/products/sweatshirt-white-1.jpg", "/products/sweatshirt-white-1.jpg"],
    createdAt: "2024-03-10"
  },
  {
    id: "remera-long",
    title: "Remera Manga Larga",
    slug: "remera-long",
    description: "Remera de manga larga en algodón premium. Puños con ribbing, fit slim. Gráfico sutil en manga.",
    collectionId: "core-basics",
    categoryId: "remeras",
    images: ["/products/tshirt-navy-1.jpg", "/products/tshirt-navy-1.jpg"],
    createdAt: "2024-03-15"
  },
  {
    id: "hoodie-tech",
    title: "Hoodie Tech",
    slug: "hoodie-tech",
    description: "Hoodie técnico con bolsillos laterales y cierre YKK. Mezcla de algodón-poliéster de secado rápido.",
    collectionId: "since-2014",
    categoryId: "hoodies",
    images: ["/products/hoodie-red-1.jpg", "/products/hoodie-red-1.jpg"],
    createdAt: "2024-03-20"
  },
  {
    id: "gorra-trucker",
    title: "Gorra Trucker",
    slug: "gorra-trucker",
    description: "Trucker con malla posterior. Frente estructurado, visera curva, cierre snapback. Parche de cuero sintético.",
    collectionId: "since-2014",
    categoryId: "gorras",
    images: ["/products/cap-black-1.jpg", "/products/cap-black-1.jpg"],
    createdAt: "2024-03-25"
  },
  {
    id: "buzo-varsity",
    title: "Buzo Varsity",
    slug: "buzo-varsity",
    description: "Buzo estilo varsity con detalles en contraste. Cuello redondo, aplicaciones bordadas, ribbing reforzado.",
    collectionId: "since-2014",
    categoryId: "buzos",
    images: ["/products/sweatshirt-white-1.jpg", "/products/sweatshirt-white-1.jpg"],
    createdAt: "2024-04-01"
  }
];

const getPrice = (categoryId: string): number => {
  if (categoryId === "hoodies") return 45000;
  if (categoryId === "buzos") return 38000;
  if (categoryId === "remeras") return 18000;
  return 15000;
};

const getSalePrice = (categoryId: string, collectionId: string, idx: number): number | undefined => {
  if (collectionId !== "since-2014" || idx !== 0) return undefined;
  if (categoryId === "hoodies") return 36000;
  if (categoryId === "buzos") return 30000;
  if (categoryId === "remeras") return 14000;
  return 12000;
};

export const variants: Variant[] = products.flatMap((product) => {
  const colors = product.categoryId === "gorras" 
    ? ["Negro", "Blanco", "Rojo"]
    : ["Negro", "Blanco", "Rojo", "Azul Marino"];
  
  const sizes = product.categoryId === "gorras"
    ? ["U"]
    : ["XS", "S", "M", "L", "XL"];

  return colors.flatMap((color) =>
    sizes.map((size, idx) => ({
      id: `${product.id}-${color.toLowerCase().replace(/\s/g, '-')}-${size.toLowerCase()}`,
      productId: product.id,
      color,
      size,
      sku: `OT-${product.id.toUpperCase()}-${color.substring(0, 2).toUpperCase()}${size}`,
      price: getPrice(product.categoryId),
      salePrice: getSalePrice(product.categoryId, product.collectionId, idx),
      stock: Math.floor(Math.random() * 20) + 5
    }))
  );
});
