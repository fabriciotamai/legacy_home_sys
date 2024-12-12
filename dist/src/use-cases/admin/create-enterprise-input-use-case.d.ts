import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Enterprise } from '@prisma/client';
interface CreateEnterpriseInput {
    name: string;
    description: string;
    investmentType: 'MONEY' | 'PROPERTY';
    isAvailable: boolean;
    currentPhaseId?: number;
    currentTaskId?: number;
    constructionType: string;
    fundingAmount: number;
    transferAmount: number;
    postalCode: string;
    city: string;
    squareMeterValue: number;
    area: number;
    floors?: number;
    completionDate?: Date;
}
export declare class CreateEnterpriseUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute(input: CreateEnterpriseInput): Promise<Enterprise>;
}
export {};
//# sourceMappingURL=create-enterprise-input-use-case.d.ts.map