import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ApproveInvestmentService } from '@/services/approve-investment-service';
import { BuyEnterpriseUseCase } from '@/use-cases/users/buy-enteprise-use-case';

export function makeBuyDirectUseCase() {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const usersRepository = new PrismaUsersRepository();

  const approveInvestmentService = new ApproveInvestmentService(
    usersRepository,
    enterpriseRepository,
  );

  const useCase = new BuyEnterpriseUseCase(
    enterpriseRepository,
    usersRepository,
    approveInvestmentService,
  );

  return useCase;
}
