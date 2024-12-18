import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { ContractInterest } from '@prisma/client';
interface InterestEnterpriseInput {
    userId: number;
    enterpriseId: number;
}
export declare class InterestEnterpriseUseCase {
    private readonly usersRepository;
    private readonly enterpriseRepository;
    constructor(usersRepository: UsersRepository, enterpriseRepository: EnterpriseRepository);
    execute(input: InterestEnterpriseInput): Promise<ContractInterest>;
}
export {};
//# sourceMappingURL=interest-enterprise-use-case.d.ts.map