import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// Admin protected routes
router.post('/', authenticateAdmin, validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', authenticateAdmin, validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authenticateAdmin, categoryController.deleteCategory);

export default router;
