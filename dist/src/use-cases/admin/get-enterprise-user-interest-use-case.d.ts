import { EnterpriseRepository } from "@/repositories/enterprise-repository";
import { Enterprise } from "@prisma/client";
export declare class GetEnterprisesWithInterestsUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute(): Promise<Enterprise[]>;
}
//# sourceMappingURL=get-enterprise-user-interest-use-case.d.ts.map