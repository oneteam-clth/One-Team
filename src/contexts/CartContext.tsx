// src/contexts/CartContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
// Ajustá estos imports si en tu repo están en otra ruta:
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export type CartLine = {
  variantId: string
  qty: number
  // Datos enriquecidos para la UI (opcionales)
  variant?: {
    id: string
    color: string
    size: string
    price: number
    sale_price: number | null
    stock: number
  }
  product?: {
    slug: string
    title: string
    imageUrl?: string
  }
}

// Legacy/UI item shape expected across the app (Cart, Checkout, Header badges)
export type LegacyCartItem = {
  variantId: string
  productId: string
  title: string
  color: string
  size: string
  price: number
  quantity: number
  image?: string
}

export type AddItemArg = { variantId: string; quantity?: number }

// Public context shape kept backward-compatible
export type CartContextShape = {
  loading: boolean
  items: LegacyCartItem[]
  total: number
  itemCount: number
  addItem: (arg: AddItemArg | LegacyCartItem) => Promise<void>
  updateQuantity: (variantId: string, qty: number) => Promise<void>
  removeItem: (variantId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartCtx = createContext<CartContextShape | null>(null)
const LOCAL_KEY = 'ot_cart_v1'

// Helpers de storage local (modo invitado)
function readLocal(): { variantId: string; qty: number }[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}
function writeLocal(items: { variantId: string; qty: number }[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [cartId, setCartId] = useState<string | null>(null)
  const [lines, setLines] = useState<CartLine[]>([])
  const [loading, setLoading] = useState(true)

  // Enriquecer líneas con datos de variante/producto para la UI
  const enrichLines = useCallback(
    async (rows: { variantId: string; qty: number }[]): Promise<CartLine[]> => {
      if (!rows.length) return []
      const ids = rows.map((r) => r.variantId)

      // Traigo variantes + producto + imágenes principales
      const { data, error } = await supabase
        .from('variants')
        .select(
          `
          id, color, size, price, sale_price, stock,
          product:products(
            slug, title,
            product_images(url, sort)
          )
        `
        )
        .in('id', ids)
      if (error) throw error

      const byId = new Map<string, any>((data || []).map((v) => [v.id, v]))
      return rows.map((r) => {
        const v = byId.get(r.variantId)
        const img = v?.product?.product_images
          ? [...v.product.product_images].sort(
              (a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0)
            )[0]?.url
          : undefined
        return {
          variantId: r.variantId,
          qty: r.qty,
          variant: v
            ? {
                id: v.id,
                color: v.color,
                size: v.size,
                price: Number(v.price),
                sale_price:
                  v.sale_price !== null && v.sale_price !== undefined
                    ? Number(v.sale_price)
                    : null,
                stock: v.stock,
              }
            : undefined,
          product: v?.product
            ? {
                slug: v.product.slug,
                title: v.product.title,
                imageUrl: img,
              }
            : undefined,
        }
      })
    },
    []
  )

  // Cargar carrito desde DB (asegura existencia)
  const loadFromDb = useCallback(
    async (uid: string) => {
      // asegurar cart del usuario
      let { data: cartRow } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', uid)
        .maybeSingle()

      if (!cartRow) {
        const ins = await supabase
          .from('carts')
          .insert({ user_id: uid })
          .select('id')
          .single()
        if (ins.error) throw ins.error
        cartRow = ins.data
      }
      setCartId(cartRow.id)

      // leer items del carrito
      const { data, error } = await supabase
        .from('cart_items')
        .select('variant_id, qty')
        .eq('cart_id', cartRow.id)
      if (error) throw error

      const enriched = await enrichLines(
        (data || []).map((r) => ({ variantId: r.variant_id, qty: r.qty }))
      )
      setLines(enriched)
    },
    [enrichLines]
  )

  // Merge guest → DB al iniciar sesión
  const mergeGuestIntoDb = useCallback(async (uid: string) => {
    const guest = readLocal()
    if (!guest.length) return

    // asegurar cart del usuario
    let { data: cartRow } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', uid)
      .maybeSingle()
    if (!cartRow) {
      const ins = await supabase
        .from('carts')
        .insert({ user_id: uid })
        .select('id')
        .single()
      if (ins.error) throw ins.error
      cartRow = ins.data
    }

    // upsert item por item
    for (const it of guest) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, qty')
        .eq('cart_id', cartRow.id)
        .eq('variant_id', it.variantId)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ qty: existing.qty + it.qty })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('cart_items')
          .insert({ cart_id: cartRow.id, variant_id: it.variantId, qty: it.qty })
      }
    }

    // limpiar local
    writeLocal([])
  }, [])

  // Carga inicial / reactividad a auth
  useEffect(() => {
    const boot = async () => {
      if (authLoading) return
      setLoading(true)
      try {
        if (user) {
          await mergeGuestIntoDb(user.id)
          await loadFromDb(user.id)
        } else {
          const local = readLocal()
          const enriched = await enrichLines(local)
          setCartId(null)
          setLines(enriched)
        }
      } finally {
        setLoading(false)
      }
    }
    void boot()
  }, [user, authLoading, mergeGuestIntoDb, loadFromDb, enrichLines])

  // Mutadores internos (sobre DB/local), operan con variantId/qty
  const setItemQty = useCallback(
    async (variantId: string, qty: number) => {
      if (qty <= 0) return removeItem(variantId)

      if (user && cartId) {
        await supabase
          .from('cart_items')
          .update({ qty })
          .eq('cart_id', cartId)
          .eq('variant_id', variantId)
        await loadFromDb(user.id)
      } else {
        const current = readLocal().map((i) =>
          i.variantId === variantId ? { ...i, qty } : i
        )
        writeLocal(current)
        const enriched = await enrichLines(current)
        setLines(enriched)
      }
    },
    [user, cartId, enrichLines, loadFromDb]
  )

  const removeItem = useCallback(
    async (variantId: string) => {
      if (user && cartId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId)
          .eq('variant_id', variantId)
        await loadFromDb(user.id)
      } else {
        const current = readLocal().filter((i) => i.variantId !== variantId)
        writeLocal(current)
        const enriched = await enrichLines(current)
        setLines(enriched)
      }
    },
    [user, cartId, enrichLines, loadFromDb]
  )

  const addItem = useCallback(
    async (arg: AddItemArg | LegacyCartItem) => {
      const variantId = (arg as any).variantId
      const quantity = (arg as any).quantity ?? 1
      if (!variantId || quantity <= 0) return

      if (user && cartId) {
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, qty')
          .eq('cart_id', cartId)
          .eq('variant_id', variantId)
          .maybeSingle()

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ qty: existing.qty + quantity })
            .eq('id', existing.id)
        } else {
          await supabase
            .from('cart_items')
            .insert({ cart_id: cartId, variant_id: variantId, qty: quantity })
        }
        await loadFromDb(user.id)
      } else {
        const current = readLocal()
        const idx = current.findIndex((i) => i.variantId === variantId)
        if (idx >= 0) current[idx].qty += quantity
        else current.push({ variantId, qty: quantity })
        writeLocal(current)
        const enriched = await enrichLines(current)
        setLines(enriched)
      }
    },
    [user, cartId, enrichLines, loadFromDb]
  )

  const clearCart = useCallback(async () => {
    if (user && cartId) {
      await supabase.from('cart_items').delete().eq('cart_id', cartId)
      await loadFromDb(user.id)
    } else {
      writeLocal([])
      setLines([])
    }
  }, [user, cartId, loadFromDb])

  // Derivados para mantener compatibilidad con UI existente
  const uiItems: LegacyCartItem[] = useMemo(() => {
    return lines.map((l) => ({
      variantId: l.variantId,
      productId: l.product?.slug || '',
      title: l.product?.title || 'Producto',
      color: l.variant?.color || '',
      size: l.variant?.size || '',
      price: (l.variant?.sale_price ?? l.variant?.price) ?? 0,
      quantity: l.qty,
      image: l.product?.imageUrl,
    }))
  }, [lines])

  const total = useMemo(() => {
    return uiItems.reduce((sum, it) => sum + it.price * it.quantity, 0)
  }, [uiItems])

  const itemCount = useMemo(() => {
    return uiItems.reduce((sum, it) => sum + it.quantity, 0)
  }, [uiItems])

  const value: CartContextShape = {
    loading,
    items: uiItems,
    total,
    itemCount,
    addItem,
    updateQuantity: setItemQty,
    removeItem,
    clearCart,
  }

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
