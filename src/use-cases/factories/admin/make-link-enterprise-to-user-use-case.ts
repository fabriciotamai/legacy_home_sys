// src/use-cases/factories/admin/make-link-user-to-enterprise-use-case.ts

import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { LinkUserToEnterpriseUseCase } from '@/use-cases/admin/link-enterprise-to-user-use-case';

export function makeLinkUserToEnterpriseUseCase(): LinkUserToEnterpriseUseCase {
  const adminRepository = new PrismaAdminRepository();
  const enterpriseRepository = new PrismaEnterpriseRepository();

  return new LinkUserToEnterpriseUseCase(adminRepository, enterpriseRepository);
}
