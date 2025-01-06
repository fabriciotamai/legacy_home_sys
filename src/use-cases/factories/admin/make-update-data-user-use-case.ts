import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AdminUpdateUserUseCase } from '@/use-cases/admin/admin-update-data-user-use-case';

export function makeAdminUpdateUserUseCase(): AdminUpdateUserUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new AdminUpdateUserUseCase(usersRepository);
}
