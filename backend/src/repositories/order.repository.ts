import prisma from '../config/database';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

export class OrderRepository {
  async createOrder(data: Prisma.OrderCreateInput) {
    return prisma.order.create({
      data,
      include: {
        items: true,
        customer: true,
        address: true,
        coupon: true,
      },
    });
  }

  async findByRazorpayOrderId(razorpayOrderId: string) {
    return prisma.order.findUnique({
      where: { razorpayOrderId },
      include: {
        items: { include: { product: true } },
        customer: true,
        address: true,
      },
    });
  }

  async findByOrderNumberAndPhone(orderNumber: string, phone: string) {
    return prisma.order.findFirst({
      where: {
        orderNumber,
        customer: { phone },
      },
      include: {
        items: { include: { product: { include: { images: true } } } },
        customer: true,
        address: true,
        payments: true,
      },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        ...(paymentStatus && { paymentStatus }),
      },
    });
  }
}

export default new OrderRepository();
