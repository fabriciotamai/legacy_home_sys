import { PrismaDepositsRepository } from '@/repositories/prisma/prisma-deposit-repository';
import { ListDepositsUseCase } from '@/use-cases/admin/list-deposit-use-case';

export function makeListDepositsUseCase(): ListDepositsUseCase {
  const depositsRepository = new PrismaDepositsRepository();
  return new ListDepositsUseCase(depositsRepository);
}
