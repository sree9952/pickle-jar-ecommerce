import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      ApiResponse.success(res, 'Admin logged in successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const profile = await authService.getProfile(adminId);
      ApiResponse.success(res, 'Profile retrieved successfully', profile);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
