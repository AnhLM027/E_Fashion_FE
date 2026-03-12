export type DiscountType = "PERCENTAGE" | "FIXED";

export interface CouponResponseDTO {
  id: string;
  code: string;
  discountValue: number;
  discountType: DiscountType;

  minOrderValue: number;
  startDate: string;
  endDate: string;

  usageLimit: number;
  isActive: boolean;

  isUsed?: boolean;
  applicable?: boolean;
  message?: string;
}

export interface CouponRequestDTO {
  code: string;
  discountValue: number;
  discountType: DiscountType;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  isActive: boolean;
}

export interface ApplyCouponRequestDTO {
  couponCode: string;
  orderTotal: number;
}

export interface ApplyCouponResponseDTO {
  applicable: boolean;
  message: string;
  discountAmount: number;
  finalTotal: number;
}