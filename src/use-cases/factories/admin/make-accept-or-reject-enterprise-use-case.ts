import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AcceptOrRejectInterestUseCase } from '@/use-cases/admin/accept-or-reject-interest-use-case';

export function makeAcceptOrRejectInterestUseCase() {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AcceptOrRejectInterestUseCase(enterpriseRepository, usersRepository);

  return useCase;
}
