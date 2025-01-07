import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { UpdateProgressUseCase } from '@/use-cases/admin/update-progress-task-use-case';

export function makeUpdateProgressUseCase(): UpdateProgressUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();

  const updateProgressUseCase = new UpdateProgressUseCase(enterpriseRepository);

  return updateProgressUseCase;
}
