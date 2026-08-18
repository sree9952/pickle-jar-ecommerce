import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
  trackOrderSchema,
} from '../validators/checkout.validator';

const router = Router();

// Public guest checkout routes
router.post('/create-razorpay-order', validate(createRazorpayOrderSchema), orderController.createRazorpayOrder);
router.post('/verify-payment', validate(verifyPaymentSchema), orderController.verifyPayment);
router.get('/track', validate(trackOrderSchema), orderController.trackOrder);

export default router;
