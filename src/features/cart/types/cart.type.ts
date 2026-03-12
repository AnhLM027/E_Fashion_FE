export interface CartItem {
  cartId: string;

  productVariantSizeId: string;

  slug: string;

  productId: string;
  productName: string;
  productImage: string;

  variantId: string;
  colorId: string;
  colorName: string;

  sizeName: string;

  price: number;
  originalPrice: number;

  quantity: number;

  imageUrl: string;

  availableStock: number;
  outOfStock: boolean;
}

export interface CartResponse {
  cartId: string;
  userId: string;
  totalPrice: number;
  items: CartItem[];
}

export interface CartState {
  cartId: string | null;
  userId: string | null;
  items: CartItem[];
  totalPrice: number;

  loading: boolean;
  updating: boolean;
  error?: string;
}
