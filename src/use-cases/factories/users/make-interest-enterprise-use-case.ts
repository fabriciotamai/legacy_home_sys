import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { InterestEnterpriseUseCase } from '@/use-cases/users/interest-enterprise-use-case';

export function makeInterestEnterpriseUseCase(): InterestEnterpriseUseCase {
  const adminRepository = new PrismaAdminRepository();
  const enterpriseRepository = new PrismaEnterpriseRepository();
  
  const interestEnterpriseUseCase = new InterestEnterpriseUseCase(
    adminRepository,
    enterpriseRepository
  );

  return interestEnterpriseUseCase;
}
