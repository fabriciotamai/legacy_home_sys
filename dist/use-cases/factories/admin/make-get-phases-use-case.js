import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetPhasesUseCase } from '@/use-cases/admin/get-phases-use-case';
export const makeGetPhasesUseCase = () => {
    const enterpriseRepository = new PrismaEnterpriseRepository();
    return new GetPhasesUseCase(enterpriseRepository);
};
