export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: "customer" | "staff" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  parent_id?: string | null;
  is_active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category_id?: string;
  brand_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  slug: string;
  description: string;

  categoryId: string;
  categoryName: string;
  categorySlug: string;

  brandId: string;
  brandName: string;
  brandSlug: string;

  colors: any[];

  thumbnail: string;

  originalPrice: number;
  salePrice: number;

  isActive: boolean;
  deletedAt: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  final_price: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  payment_status: "unpaid" | "paid" | "refunded" | "failed";
  created_at: string;
}
