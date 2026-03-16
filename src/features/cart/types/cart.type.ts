export interface CartVariant {
  id: string
  colorName: string
  sizeName: string
  stock: number
}

export interface CartItem {
  productVariantSizeId: string

  slug: string

  productId: string
  productName: string
  productImage: string

  colorName: string
  sizeName: string

  price: number
  quantity: number

  availableStock: number
  outOfStock: boolean

  /* dùng để đổi color / size */
  colors: string[]
  sizes: string[]
  variantSizes: CartVariant[]
}

export interface CartResponse {
  cartId: string
  userId: string
  totalPrice: number
  items: CartItem[]
}

export interface CartState {
  cartId: string | null
  userId: string | null
  items: CartItem[]
  totalPrice: number

  loading: boolean
  updating: boolean
  error?: string
}