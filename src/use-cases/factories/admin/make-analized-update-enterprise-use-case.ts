import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AnalyzeEnterpriseUpdateImpactUseCase } from '@/use-cases/admin/analized-enterprise-update-values-use-case';

export function makeAnalyzeEnterpriseUpdateImpactUseCase(): AnalyzeEnterpriseUpdateImpactUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const usersRepository = new PrismaUsersRepository();

  return new AnalyzeEnterpriseUpdateImpactUseCase(enterpriseRepository, usersRepository);
}
