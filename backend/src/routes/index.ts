import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import couponRoutes from './coupon.routes';
import orderRoutes from './order.routes';

import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

export default router;
