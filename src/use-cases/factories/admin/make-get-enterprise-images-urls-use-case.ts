

import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetEnterpriseImageUrlsUseCase } from '@/use-cases/admin/get-enterprise-image-urls-use-case';

export function makeGetEnterpriseImageUrlsUseCase(): GetEnterpriseImageUrlsUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  return new GetEnterpriseImageUrlsUseCase(enterpriseRepository);
}
