import { PrismaDepositsRepository } from '@/repositories/prisma/prisma-deposit-repository';
import { CreateDepositUseCase } from '@/use-cases/users/user-create-deposit-use-case';

export function makeCreateDepositUseCase(): CreateDepositUseCase {
  const depositsRepository = new PrismaDepositsRepository();
  return new CreateDepositUseCase(depositsRepository);
}
