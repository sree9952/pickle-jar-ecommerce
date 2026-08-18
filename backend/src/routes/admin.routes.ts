import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Protect all admin routes with JWT middleware
router.use(authenticateAdmin);

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.get('/inventory-logs', adminController.getInventoryLogs);

export default router;
