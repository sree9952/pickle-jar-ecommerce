import productRepository from '../repositories/product.repository';
import categoryRepository from '../repositories/category.repository';
import { ApiError } from '../utils/apiError';
import { Prisma } from '@prisma/client';

export class ProductService {
  async getProducts(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
        { ingredients: { contains: query.search } },
      ];
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }

    if (query.isBestSeller !== undefined) {
      where.isBestSeller = query.isBestSeller;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (query.sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (query.sortBy === 'name') orderBy = { name: 'asc' };

    const { products, total } = await productRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy,
    });

    return { products, page, limit, total };
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw ApiError.notFound(`Product with slug '${slug}' not found`);
    }

    const related = await productRepository.findRelated(product.categoryId, product.id);
    return { product, related };
  }

  async createProduct(data: any) {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw ApiError.badRequest('Invalid Category ID specified');
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existingSlug = await productRepository.findBySlug(slug);
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const { images, categoryId, ...productData } = data;

    return productRepository.create({
      ...productData,
      slug: finalSlug,
      category: { connect: { id: data.categoryId } },
      images: images?.length
        ? {
            create: images.map((img: any, idx: number) => ({
              imageUrl: img.imageUrl,
              publicId: img.publicId,
              isPrimary: img.isPrimary || idx === 0,
              sortOrder: idx,
            })),
          }
        : undefined,
    });
  }

  async updateProduct(id: string, data: any) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    const { images, categoryId, ...updateData } = data;

    return productRepository.update(id, {
      ...updateData,
      ...(categoryId && { category: { connect: { id: categoryId } } }),
    });
  }

  async deleteProduct(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    return productRepository.softDelete(id);
  }
}

export default new ProductService();
