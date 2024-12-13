

import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { GetAllUsersUseCase } from '@/use-cases/admin/get-all-users-use-case';

export function makeGetAllUsersUseCase(): GetAllUsersUseCase {
  const adminRepository = new PrismaAdminRepository();
  return new GetAllUsersUseCase(adminRepository);
}
