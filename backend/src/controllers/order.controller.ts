import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import { ApiResponse } from '../utils/apiResponse';

export class OrderController {
  async createRazorpayOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await orderService.createRazorpayOrder(req.body);
      ApiResponse.created(res, 'Razorpay order created successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const verifiedOrder = await orderService.verifyPayment(req.body);
      ApiResponse.success(res, 'Payment verified and order confirmed successfully', verifiedOrder);
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderNumber, phone } = req.query as { orderNumber: string; phone: string };
      const order = await orderService.trackOrder(orderNumber, phone);
      ApiResponse.success(res, 'Order details retrieved successfully', order);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
