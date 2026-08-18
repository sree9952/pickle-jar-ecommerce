import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/category.service';
import { ApiResponse } from '../utils/apiResponse';

export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getCategories();
      ApiResponse.success(res, 'Categories retrieved successfully', categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategoryBySlug(slug);
      ApiResponse.success(res, 'Category details retrieved successfully', category);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.createCategory(req.body);
      ApiResponse.created(res, 'Category created successfully', category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      ApiResponse.success(res, 'Category updated successfully', category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      ApiResponse.success(res, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
