import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetEnterprisesAvailableUseCase } from '@/use-cases/users/get-enterprise-available-use-case';
export function makeGetEnterprisesAvailableUseCase() {
    const enterpriseRepository = new PrismaEnterpriseRepository();
    const getEnterprisesUseCase = new GetEnterprisesAvailableUseCase(enterpriseRepository);
    return getEnterprisesUseCase;
}
