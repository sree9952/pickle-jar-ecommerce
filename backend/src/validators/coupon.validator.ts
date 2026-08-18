import { z } from 'zod';

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    cartAmount: z.number().positive('Cart amount must be greater than 0'),
  }),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3, 'Coupon code must be at least 3 characters'),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().positive('Discount value must be positive'),
    minOrderAmount: z.number().min(0).optional().default(0),
    maxDiscountAmount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    expiresAt: z.string().optional(),
  }),
});
