import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export class ProductRepository {
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        where: {
          deletedAt: null,
          isActive: true,
          ...where,
        },
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { select: { id: true, imageUrl: true, isPrimary: true, sortOrder: true } },
        },
      }),
      prisma.product.count({
        where: {
          deletedAt: null,
          isActive: true,
          ...where,
        },
      }),
    ]);
    return { products, total };
  }

  async findBySlug(slug: string) {
    return prisma.product.findFirst({
      where: { slug, deletedAt: null, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, imageUrl: true, publicId: true, isPrimary: true, sortOrder: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: {
        category: true,
        images: true,
      },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async findRelated(categoryId: string, currentProductId: string, limit = 4) {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
        deletedAt: null,
        isActive: true,
      },
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, imageUrl: true, isPrimary: true } },
      },
    });
  }
}

export default new ProductRepository();
