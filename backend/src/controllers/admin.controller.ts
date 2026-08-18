import { Request, Response, NextFunction } from 'express';
import adminService from '../services/admin.service';
import { ApiResponse } from '../utils/apiResponse';

export class AdminController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();
      ApiResponse.success(res, 'Dashboard KPI metrics retrieved', stats);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminService.getAllOrders(req.query as any);
      ApiResponse.paginated(
        res,
        'Admin orders list retrieved',
        result.orders,
        result.page,
        result.limit,
        result.total
      );
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;
      const updated = await adminService.updateOrderStatus(id, status, trackingNumber);
      ApiResponse.success(res, 'Order status updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  async getInventoryLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.query as { productId?: string };
      const logs = await adminService.getInventoryLogs(productId);
      ApiResponse.success(res, 'Inventory logs retrieved', logs);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
