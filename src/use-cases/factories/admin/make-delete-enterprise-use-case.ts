// src/use-cases/factories/enterprise/make-delete-enterprise-use-case.ts

import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { DeleteEnterpriseUseCase } from '@/use-cases/admin/delete-enterprise-use-case';

export function makeDeleteEnterpriseUseCase(): DeleteEnterpriseUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  return new DeleteEnterpriseUseCase(enterpriseRepository);
}
