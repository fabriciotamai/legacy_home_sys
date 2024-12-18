import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { EnterpriseStatus, Prisma } from '@prisma/client';
interface GetAllEnterprisesInput {
    status?: EnterpriseStatus;
    investmentType?: 'MONEY' | 'PROPERTY';
    isAvailable?: boolean;
}
type EnterpriseWithContractInterests = Prisma.EnterpriseGetPayload<{
    include: {
        contractInterests: true;
    };
}>;
export declare class GetEnterprisesAvailableUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute(filters: GetAllEnterprisesInput): Promise<EnterpriseWithContractInterests[]>;
}
export {};
//# sourceMappingURL=get-enterprise-available-use-case.d.ts.map