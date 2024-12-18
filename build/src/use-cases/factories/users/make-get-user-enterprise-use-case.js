import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetUserEnterprisesUseCase } from '@/use-cases/users/get-user-enterprise-use-case';
export function makeGetUserEnterprisesUseCase() {
    const enterpriseRepository = new PrismaEnterpriseRepository();
    const getUserEnterprisesUseCase = new GetUserEnterprisesUseCase(enterpriseRepository);
    return getUserEnterprisesUseCase;
}
