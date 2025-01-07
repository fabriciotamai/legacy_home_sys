import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ApproveInvestmentService } from '@/services/approve-investment-service';
import { AcceptOrRejectInterestUseCase } from '@/use-cases/admin/accept-or-reject-interest-use-case';

export function makeAcceptOrRejectInterestUseCase() {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const usersRepository = new PrismaUsersRepository();

  const approveInvestmentService = new ApproveInvestmentService(
    usersRepository,
    enterpriseRepository,
  );

  const useCase = new AcceptOrRejectInterestUseCase(
    enterpriseRepository,
    usersRepository,
    approveInvestmentService,
  );

  return useCase;
}
