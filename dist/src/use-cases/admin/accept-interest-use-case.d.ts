import { EnterpriseRepository } from "@/repositories/enterprise-repository";
import { ContractInterest } from "@prisma/client";
interface AcceptOrRejectInterestInput {
    interestId: string;
    status: "APPROVED" | "REJECTED";
}
export declare class AcceptOrRejectInterestUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute(input: AcceptOrRejectInterestInput): Promise<ContractInterest>;
}
export {};
//# sourceMappingURL=accept-interest-use-case.d.ts.map