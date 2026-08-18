import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.get('/profile', authenticateAdmin, authController.getProfile);

export default router;
