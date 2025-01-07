import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetPhasesUseCase } from '@/use-cases/admin/get-phases-use-case';

export const makeGetPhasesUseCase = (): GetPhasesUseCase => {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  return new GetPhasesUseCase(enterpriseRepository);
};
