import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productService.getProducts(req.query as any);
      ApiResponse.paginated(
        res,
        'Products retrieved successfully',
        result.products,
        result.page,
        result.limit,
        result.total
      );
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const result = await productService.getProductBySlug(slug);
      ApiResponse.success(res, 'Product details retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);
      ApiResponse.created(res, 'Product created successfully', product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      ApiResponse.success(res, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      ApiResponse.success(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
