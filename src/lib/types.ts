export type Collection = { id: string; name: string; slug: string }
export type Category = { id: string; name: string; slug: string }
export type ProductImage = { id: string; url: string; alt: string | null; sort: number }
export type Variant = {
id: string; product_id: string; color: string; size: 'XS'|'S'|'M'|'L'|'XL'|'ONE_SIZE'
sku: string; price: number; sale_price: number | null; stock: number
}
export type Product = {
id: string; title: string; slug: string; description: string | null; active: boolean
collection_id: string | null; category_id: string | null; created_at: string
images?: ProductImage[]; variants?: Variant[]
collection?: Pick<Collection,'name'|'slug'> | null
category?: Pick<Category,'name'|'slug'> | null
}


export type Review = {
id: string; product_id: string; user_id: string; rating: number; comment: string | null
photos: any | null; is_approved: boolean; created_at: string
}


export type Address = {
id: string; user_id: string; label: string | null; first_name: string; last_name: string
phone: string | null; dni: string | null; country: string; province: string; city: string
zip: string; street1: string; street2: string | null; created_at: string; updated_at: string
}