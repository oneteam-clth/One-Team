export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  collectionId: string;
  categoryId: string;
  images: string[];
  createdAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  variantId: string;
  productId: string;
  quantity: number;
  title: string;
  color: string;
  size: string;
  price: number;
  image: string;
}
