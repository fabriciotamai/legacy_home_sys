import { PrismaContractRepository } from '@/repositories/prisma/prisma-contract-repository';
import { ProcessContractSignatureUseCase } from '@/use-cases/admin/process-signature-contract-use-case';

export function makeProcessContractSignatureUseCase(): ProcessContractSignatureUseCase {
  const contractRepository = new PrismaContractRepository();
  return new ProcessContractSignatureUseCase(contractRepository);
}
