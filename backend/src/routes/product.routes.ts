import { Router } from 'express';
import productController from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from '../validators/product.validator';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', validate(getProductsQuerySchema), productController.getProducts);
router.get('/slug/:slug', productController.getProductBySlug);

// Admin protected routes
router.post('/', authenticateAdmin, validate(createProductSchema), productController.createProduct);
router.put('/:id', authenticateAdmin, validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authenticateAdmin, productController.deleteProduct);

export default router;
