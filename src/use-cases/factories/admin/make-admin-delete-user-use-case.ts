import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { DeleteUserUseCase } from '@/use-cases/admin/admin-delete-user-use-case';

export function makeDeleteUserUseCase(): DeleteUserUseCase {
  const adminRepository = new PrismaAdminRepository();
  return new DeleteUserUseCase(adminRepository);
}
