import { AdminRepository } from "@/repositories/admin-repository";
import { EnterpriseRepository } from "@/repositories/enterprise-repository";
import { ContractInterest } from "@prisma/client";
interface LinkUserToEnterpriseInput {
    userId: number;
    enterpriseId: number;
}
export declare class LinkUserToEnterpriseUseCase {
    private readonly adminRepository;
    private readonly enterpriseRepository;
    constructor(adminRepository: AdminRepository, enterpriseRepository: EnterpriseRepository);
    execute(input: LinkUserToEnterpriseInput): Promise<ContractInterest>;
}
export {};
//# sourceMappingURL=link-enterprise-to-user-use-case.d.ts.map