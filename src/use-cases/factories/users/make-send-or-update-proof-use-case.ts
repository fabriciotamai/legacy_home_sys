import { PrismaDepositsRepository } from '@/repositories/prisma/prisma-deposit-repository';
import { SendOrUpdateProofUseCase } from '@/use-cases/users/send-or-update-proof-use-case';

export function makeSendOrUpdateProofUseCase(): SendOrUpdateProofUseCase {
  const depositsRepository = new PrismaDepositsRepository();
  return new SendOrUpdateProofUseCase(depositsRepository);
}
