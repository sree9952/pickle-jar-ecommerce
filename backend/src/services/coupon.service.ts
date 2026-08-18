import couponRepository from '../repositories/coupon.repository';
import { ApiError } from '../utils/apiError';

export class CouponService {
  async validateCoupon(code: string, cartAmount: number) {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) {
      throw ApiError.notFound('Invalid or expired coupon code');
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      throw ApiError.badRequest('Coupon has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw ApiError.badRequest('Coupon usage limit reached');
    }

    const minAmount = Number(coupon.minOrderAmount);
    if (cartAmount < minAmount) {
      throw ApiError.badRequest(
        `Minimum order amount to apply coupon '${coupon.code}' is ₹${minAmount}`
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (cartAmount * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    discountAmount = Math.min(discountAmount, cartAmount);

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discountAmount,
      finalAmount: cartAmount - discountAmount,
    };
  }

  async getAllCoupons() {
    return couponRepository.findAll();
  }

  async createCoupon(data: any) {
    const existing = await couponRepository.findByCode(data.code);
    if (existing) {
      throw ApiError.conflict(`Coupon code '${data.code.toUpperCase()}' already exists`);
    }

    return couponRepository.create({
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: data.minOrderAmount || 0,
      maxDiscountAmount: data.maxDiscountAmount,
      usageLimit: data.usageLimit,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    });
  }
}

export default new CouponService();
