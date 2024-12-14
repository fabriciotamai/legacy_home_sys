import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetEnterprisesWithInterestsUseCase } from '@/use-cases/admin/get-enterprise-user-interest-use-case';
export function makeGetEnterprisesWithInterestsUseCase() {
    const enterpriseRepository = new PrismaEnterpriseRepository();
    return new GetEnterprisesWithInterestsUseCase(enterpriseRepository);
}
