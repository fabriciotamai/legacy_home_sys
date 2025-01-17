import { PrismaContractRepository } from '@/repositories/prisma/prisma-contract-repository';
import { UploadContractTemplateUseCase } from '@/use-cases/admin/upload-contract-template-use-case';

export function makeUploadContractTemplateUseCase(): UploadContractTemplateUseCase {
  const contractRepository = new PrismaContractRepository();
  return new UploadContractTemplateUseCase(contractRepository);
}
