import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetAdminDashboardDataUseCase } from '@/use-cases/admin/get-admin-dashboard-use-case';
import { SigninUsers } from '../../users/signin-users';

export function makeUserSignin(): SigninUsers {
  const userRepository = new PrismaUsersRepository();
  const adminRepository = new PrismaAdminRepository();
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const getAdminDashboardDataUseCase = new GetAdminDashboardDataUseCase(
    adminRepository,
    enterpriseRepository,
  );
  return new SigninUsers(userRepository, getAdminDashboardDataUseCase);
}
