import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { CreateEnterpriseUseCase } from '@/use-cases/admin/create-enterprise-input-use-case';

export function makeCreateEnterpriseUseCase(): CreateEnterpriseUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const createEnterpriseUseCase = new CreateEnterpriseUseCase(
    enterpriseRepository,
  );

  return createEnterpriseUseCase;
}
