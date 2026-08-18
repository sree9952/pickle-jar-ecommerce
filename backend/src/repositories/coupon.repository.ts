import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export class CouponRepository {
  async findByCode(code: string) {
    return prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), deletedAt: null, isActive: true },
    });
  }

  async findAll() {
    return prisma.coupon.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
  }

  async incrementUsage(id: string) {
    return prisma.coupon.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }
}

export default new CouponRepository();
