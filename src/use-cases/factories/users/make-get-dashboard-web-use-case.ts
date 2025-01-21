import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetDashboardWebDataUseCase } from '@/use-cases/users/get-user-dashboard-web-usecase';

export function makeGetDashboardWebDataUseCase(): GetDashboardWebDataUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new GetDashboardWebDataUseCase(usersRepository);
}
