import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import adminRepository from '../repositories/admin.repository';
import { env } from '../config/env.config';
import { ApiError } from '../utils/apiError';

export class AuthService {
  async login(email: string, pass: string) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    const isMatch = await bcrypt.compare(pass, admin.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async getProfile(adminId: string) {
    const admin = await adminRepository.findById(adminId);
    if (!admin) {
      throw ApiError.notFound('Admin profile not found');
    }
    return admin;
  }
}

export default new AuthService();
