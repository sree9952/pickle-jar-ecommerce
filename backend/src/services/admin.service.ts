import prisma from '../config/database';
import { ApiError } from '../utils/apiError';

export class AdminService {
  async getDashboardStats() {
    const [totalRevenueResult, totalOrders, pendingOrders, totalProducts, lowStockProducts, totalCustomers] =
      await Promise.all([
        prisma.order.aggregate({
          where: { paymentStatus: 'PAID' },
          _sum: { totalAmount: true },
        }),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.product.count({ where: { deletedAt: null } }),
        prisma.product.count({ where: { deletedAt: null, stockQuantity: { lte: 10 } } }),
        prisma.customer.count(),
      ]);

    const totalRevenue = totalRevenueResult._sum.totalAmount
      ? Number(totalRevenueResult._sum.totalAmount)
      : 0;

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    });

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      recentOrders,
    };
  }

  async getAllOrders(query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where = query.status ? { status: query.status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          address: true,
          items: true,
          payments: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, page, limit, total };
  }

  async updateOrderStatus(id: string, status: string, trackingNumber?: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  async getInventoryLogs(productId?: string) {
    return prisma.inventoryLog.findMany({
      where: productId ? { productId } : {},
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true } },
        adminUser: { select: { id: true, name: true, email: true } },
      },
    });
  }
}

export default new AdminService();
