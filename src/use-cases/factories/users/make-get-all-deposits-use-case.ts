import { PrismaDepositsRepository } from '@/repositories/prisma/prisma-deposit-repository';
import { GetAllDepositsUseCase } from '@/use-cases/users/get-all-deposits-use-case';

export function makeGetAllDepositsUseCase(): GetAllDepositsUseCase {
  const depositsRepository = new PrismaDepositsRepository();
  return new GetAllDepositsUseCase(depositsRepository);
}
