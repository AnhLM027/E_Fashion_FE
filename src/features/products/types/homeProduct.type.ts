export interface HomeProduct {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  minPrice: number;
  maxPrice: number;
  isOnSale: number;   // backend trả 0/1
  totalSold?: number; // chỉ có ở best seller
}