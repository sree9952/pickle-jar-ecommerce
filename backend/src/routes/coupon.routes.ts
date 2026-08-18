import { Router } from 'express';
import couponController from '../controllers/coupon.controller';
import { validate } from '../middlewares/validate.middleware';
import { validateCouponSchema, createCouponSchema } from '../validators/coupon.validator';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public route for cart coupon validation
router.post('/validate', validate(validateCouponSchema), couponController.validateCoupon);

// Admin protected routes
router.get('/', authenticateAdmin, couponController.getAllCoupons);
router.post('/', authenticateAdmin, validate(createCouponSchema), couponController.createCoupon);

export default router;
