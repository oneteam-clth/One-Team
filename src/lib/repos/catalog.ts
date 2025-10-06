import { getSupabase } from '../supabase'
import type { Product, Collection, Category } from '../types'


export async function listCollections(): Promise<Collection[]> {
const sb = getSupabase()
const { data, error } = await sb.from('collections').select('id,name,slug').order('name')
if (error) throw error
return data || []
}


export async function listCategories(): Promise<Category[]> {
const sb = getSupabase()
const { data, error } = await sb.from('categories').select('id,name,slug').order('name')
if (error) throw error
return data || []
}


export type ListProductsParams = {
limit?: number
page?: number
collectionSlug?: string
categorySlug?: string
search?: string
}


export async function listProducts(params: ListProductsParams = {}) {
const { limit = 24, page = 1, collectionSlug, categorySlug, search } = params
const from = (page - 1) * limit
const to = from + limit - 1


const sb = getSupabase()
// Usamos joins con !inner para poder filtrar por slug embebido
let query = sb
.from('products')
.select(`
id, title, slug, description, active, created_at,
collection:collections!inner(name,slug),
category:categories!left(name,slug),
images:product_images(url,alt,sort),
variants(id, color, size, sku, price, sale_price, stock)
`, { count: 'exact' })
.eq('active', true)
.order('created_at', { ascending: false })
.range(from, to)


if (collectionSlug) query = query.eq('collections.slug', collectionSlug)
if (categorySlug) query = query.eq('categories.slug', categorySlug)
if (search) query = query.ilike('title', `%${search}%`)


const { data, error, count } = await query
if (error) throw error
return { items: (data as unknown as Product[]) || [], total: count || 0 }
}


export async function getProductBySlug(slug: string): Promise<Product | null> {
const sb = getSupabase()
const { data, error } = await sb
.from('products')
.select(`
id, title, slug, description, active, created_at,
collection:collections!left(name,slug),
category:categories!left(name,slug),
images:product_images(url,alt,sort),
variants(id, color, size, sku, price, sale_price, stock)
`)
.eq('slug', slug)
.single()
if (error) throw error
return data as unknown as Product
}