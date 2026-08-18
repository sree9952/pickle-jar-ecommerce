import { Request, Response, NextFunction } from 'express';
import couponService from '../services/coupon.service';
import { ApiResponse } from '../utils/apiResponse';

export class CouponController {
  async validateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, cartAmount } = req.body;
      const result = await couponService.validateCoupon(code, cartAmount);
      ApiResponse.success(res, 'Coupon is valid', result);
    } catch (error) {
      next(error);
    }
  }

  async getAllCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await couponService.getAllCoupons();
      ApiResponse.success(res, 'Coupons retrieved successfully', coupons);
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await couponService.createCoupon(req.body);
      ApiResponse.created(res, 'Coupon created successfully', coupon);
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponController();
