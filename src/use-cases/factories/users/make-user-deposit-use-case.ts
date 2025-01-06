import { PrismaDepositsRepository } from '@/repositories/prisma/prisma-deposit-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { CreateDepositUseCase } from '@/use-cases/users/user-create-deposit-use-case';

export function makeCreateDepositUseCase(): CreateDepositUseCase {
  const depositsRepository = new PrismaDepositsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new CreateDepositUseCase(depositsRepository, usersRepository);
}
