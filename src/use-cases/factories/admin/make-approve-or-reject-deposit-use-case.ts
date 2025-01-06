import { PrismaDepositsRepository } from '@/repositories/prisma/prisma-deposit-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ApproveOrRejectDepositUseCase } from '@/use-cases/admin/approve-or-reject-deposit-use-case';

export function makeApproveOrRejectDepositUseCase(): ApproveOrRejectDepositUseCase {
  const depositsRepository = new PrismaDepositsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new ApproveOrRejectDepositUseCase(depositsRepository, usersRepository);
}
