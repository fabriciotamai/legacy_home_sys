import { EnterpriseRepository } from "@/repositories/enterprise-repository";
import { Enterprise, EnterpriseStatus } from "@prisma/client";
interface GetAllEnterprisesInput {
    status?: EnterpriseStatus;
    investmentType?: "MONEY" | "PROPERTY";
    isAvailable?: boolean;
}
export declare class GetAllEnterprisesUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute(filters: GetAllEnterprisesInput): Promise<Enterprise[]>;
}
export {};
//# sourceMappingURL=get-all-enterprise-use-case.d.ts.map