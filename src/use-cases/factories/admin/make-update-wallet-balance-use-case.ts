import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdateWalletBalanceUseCase } from '@/use-cases/admin/update-wallet-balance-use-case';

export function makeUpdateWalletBalanceUseCase(): UpdateWalletBalanceUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new UpdateWalletBalanceUseCase(usersRepository);
}
