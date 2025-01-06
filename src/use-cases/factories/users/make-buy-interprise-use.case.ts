import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ApproveInvestmentService } from '@/services/approve-investment-service';
import { BuyEnteprisetUseCase } from '@/use-cases/users/buy-enteprise-use-case';

export function makeBuyDirectUseCase() {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const usersRepository = new PrismaUsersRepository();

  const approveInvestmentService = new ApproveInvestmentService(usersRepository, enterpriseRepository);

  const useCase = new BuyEnteprisetUseCase(enterpriseRepository, usersRepository, approveInvestmentService);

  return useCase;
}
