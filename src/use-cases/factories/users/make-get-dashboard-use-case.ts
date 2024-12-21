import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetDashboardDataUseCase } from '@/use-cases/users/get-dashboard-use-case';

export function makeGetDashboardDataUseCase(): GetDashboardDataUseCase {
  const usersRepository = new PrismaUsersRepository();
  const getDashboardDataUseCase = new GetDashboardDataUseCase(usersRepository);

  return getDashboardDataUseCase;
}
