import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetAllEnterprisesUseCase } from '@/use-cases/admin/get-all-enterprise-use-case';

export function makeGetAllEnterprisesUseCase(): GetAllEnterprisesUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  return new GetAllEnterprisesUseCase(enterpriseRepository);
}
