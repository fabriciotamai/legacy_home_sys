import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { AcceptOrRejectInterestUseCase } from '@/use-cases/admin/accept-interest-use-case';

export function makeAcceptOrRejectInterestUseCase() {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const useCase = new AcceptOrRejectInterestUseCase(enterpriseRepository);

  return useCase;
}
