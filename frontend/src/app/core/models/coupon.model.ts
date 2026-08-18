export interface Coupon {
  couponId?: string;
  id?: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  finalAmount?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiresAt?: string;
  isActive?: boolean;
}
