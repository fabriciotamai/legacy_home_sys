import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetAdminDashboardDataUseCase } from '@/use-cases/admin/get-admin-dashboard-use-case';

export function makeGetAdminDashboardDataUseCase(): GetAdminDashboardDataUseCase {
  const adminRepository = new PrismaAdminRepository();
  const enterpriseRepository = new PrismaEnterpriseRepository();

  return new GetAdminDashboardDataUseCase(
    adminRepository,
    enterpriseRepository,
  );
}
