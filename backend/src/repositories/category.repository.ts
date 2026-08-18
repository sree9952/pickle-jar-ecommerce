import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findFirst({
      where: { slug, deletedAt: null, isActive: true },
    });
  }

  async findById(id: string) {
    return prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}

export default new CategoryRepository();
