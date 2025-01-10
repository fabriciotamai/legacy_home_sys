// src/use-cases/factories/enterprise/make-get-enterprise-image-urls-use-case.ts

import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetEnterpriseImageUrlsUseCase } from '@/use-cases/admin/get-enterprise-Image-urls-use-case';

export function makeGetEnterpriseImageUrlsUseCase(): GetEnterpriseImageUrlsUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  return new GetEnterpriseImageUrlsUseCase(enterpriseRepository);
}
