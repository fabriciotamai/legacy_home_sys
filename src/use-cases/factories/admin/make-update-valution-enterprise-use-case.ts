import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdateEnterpriseValuationUseCase } from '@/use-cases/admin/update-valution-enterprise-use-case';

export function makeUpdateEnterpriseValuationUseCase(): UpdateEnterpriseValuationUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  const usersRepository = new PrismaUsersRepository();

  return new UpdateEnterpriseValuationUseCase(
    enterpriseRepository,
    usersRepository,
  );
}
