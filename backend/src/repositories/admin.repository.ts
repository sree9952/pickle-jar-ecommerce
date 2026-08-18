import prisma from '../config/database';

export class AdminRepository {
  async findByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string) {
    return prisma.adminUser.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });
  }
}

export default new AdminRepository();
