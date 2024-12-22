import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AcceptOrRejectComplianceUseCase } from '@/use-cases/admin/accept-or-reject-compliance-use-case';

export function makeAcceptOrRejectComplianceUseCase(): AcceptOrRejectComplianceUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new AcceptOrRejectComplianceUseCase(usersRepository);
}
