import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Enterprise } from '@prisma/client';
interface GetUserEnterprisesInput {
    userId: number;
}
export declare class GetUserEnterprisesUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute({ userId }: GetUserEnterprisesInput): Promise<Enterprise[]>;
}
export {};
//# sourceMappingURL=get-user-enterprise-use-case.d.ts.map