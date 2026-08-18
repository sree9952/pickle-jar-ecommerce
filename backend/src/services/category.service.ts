import categoryRepository from '../repositories/category.repository';
import { ApiError } from '../utils/apiError';

export class CategoryService {
  async getCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return category;
  }

  async createCategory(data: { name: string; description?: string; imageUrl?: string }) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw ApiError.conflict(`Category with slug '${slug}' already exists`);
    }

    return categoryRepository.create({
      name: data.name,
      slug,
      description: data.description,
      imageUrl: data.imageUrl,
    });
  }

  async updateCategory(id: string, data: { name?: string; description?: string; imageUrl?: string }) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    let slug = category.slug;
    if (data.name && data.name !== category.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    return categoryRepository.update(id, {
      ...data,
      slug,
    });
  }

  async deleteCategory(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return categoryRepository.softDelete(id);
  }
}

export default new CategoryService();
