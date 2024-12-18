import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { InterestEnterpriseUseCase } from '@/use-cases/users/interest-enterprise-use-case';
export function makeInterestEnterpriseUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const enterpriseRepository = new PrismaEnterpriseRepository();
    const interestEnterpriseUseCase = new InterestEnterpriseUseCase(usersRepository, enterpriseRepository);
    return interestEnterpriseUseCase;
}
