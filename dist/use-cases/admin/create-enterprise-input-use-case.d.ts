import { EnterpriseRepository } from '@/repositories/enterprise-repository';
interface CreateEnterpriseInput {
    name: string;
    description: string;
    investmentType: 'MONEY' | 'PROPERTY';
    isAvailable: boolean;
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
interface CreateEnterpriseOutput {
    message: string;
    enterprise: {
        id: number;
        name: string;
        description: string;
        status: string;
        isAvailable: boolean;
        investmentType: string;
        constructionType: string;
        fundingAmount: number;
        transferAmount: number;
        postalCode: string;
        city: string;
        squareMeterValue: number;
        area: number;
        progress: number;
        floors?: number | null;
        completionDate?: Date | null;
        currentPhaseId: number | null;
        currentTaskId: number | null;
        createdAt: Date;
        updatedAt: Date;
        currentPhase: {
            phaseId: number;
            phaseName: string;
            description: string;
            progress: number;
            tasks: {
                taskId: number;
                taskName: string;
                isCompleted: boolean;
            }[];
        };
        currentTask?: {
            taskId: number;
            taskName: string;
            isCompleted: boolean;
        };
    };
}
export declare class CreateEnterpriseUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute(input: CreateEnterpriseInput): Promise<CreateEnterpriseOutput>;
    private validateInput;
    private initializePhasesAndTasks;
}
export {};
//# sourceMappingURL=create-enterprise-input-use-case.d.ts.map