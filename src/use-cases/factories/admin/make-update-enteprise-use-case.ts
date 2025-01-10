import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AnalyzeEnterpriseUpdateImpactUseCase } from '@/use-cases/admin/analized-enterprise-update-values-use-case';
import { UpdateEnterpriseUseCase } from '@/use-cases/admin/update-enterprise-use-case';

export function makeUpdateEnterpriseUseCase(): UpdateEnterpriseUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository(); 
  const usersRepository = new PrismaUsersRepository();
  const analyzeImpactUseCase = new AnalyzeEnterpriseUpdateImpactUseCase(enterpriseRepository, usersRepository);

  return new UpdateEnterpriseUseCase(enterpriseRepository, analyzeImpactUseCase);
}
