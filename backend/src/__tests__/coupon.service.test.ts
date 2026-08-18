import couponService from '../services/coupon.service';
import couponRepository from '../repositories/coupon.repository';
import { DiscountType } from '@prisma/client';

// Mock Coupon Repository
jest.mock('../repositories/coupon.repository');

describe('CouponService - Discount Calculations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should correctly calculate 10% percentage discount', async () => {
    const mockCoupon = {
      id: 'coupon-1',
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10.0,
      minOrderAmount: 200.0,
      maxDiscountAmount: 100.0,
      usageLimit: 100,
      usageCount: 5,
      expiresAt: null,
      isActive: true,
    };

    (couponRepository.findByCode as jest.Mock).mockResolvedValue(mockCoupon);

    const result = await couponService.validateCoupon('WELCOME10', 500);

    expect(result.discountAmount).toBe(50);
    expect(result.finalAmount).toBe(450);
    expect(result.code).toBe('WELCOME10');
  });

  test('should throw error if cart amount is below minimum spend threshold', async () => {
    const mockCoupon = {
      id: 'coupon-2',
      code: 'MIN500',
      discountType: DiscountType.FIXED,
      discountValue: 50.0,
      minOrderAmount: 500.0,
      isActive: true,
    };

    (couponRepository.findByCode as jest.Mock).mockResolvedValue(mockCoupon);

    await expect(couponService.validateCoupon('MIN500', 300)).rejects.toThrow(
      "Minimum order amount to apply coupon 'MIN500' is ₹500"
    );
  });
});
