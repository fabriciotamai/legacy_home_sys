import { PrismaContractRepository } from '@/repositories/prisma/prisma-contract-repository';
import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GenerateContractUseCase } from '@/use-cases/admin/generate-contract-input-use-case';

export function makeGenerateContractUseCase(): GenerateContractUseCase {
  const contractRepository = new PrismaContractRepository();
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const usersRepository = new PrismaUsersRepository();

  return new GenerateContractUseCase(
    contractRepository,
    enterpriseRepository,
    usersRepository
  );
}
