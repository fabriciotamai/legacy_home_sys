import { ContractInterest, Enterprise, EnterpriseStatus, InterestStatus, Phase, Prisma, Task } from '@prisma/client';
export interface EnterpriseRepository {
    findById(enterpriseId: number): Promise<Enterprise | null>;
    findByName(name: string): Promise<Enterprise | null>;
    findAll(filters: {
        status?: EnterpriseStatus;
        investmentType?: 'MONEY' | 'PROPERTY';
        isAvailable?: boolean;
    }): Promise<Enterprise[]>;
    create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>;
    update(enterpriseId: number, data: Prisma.EnterpriseUpdateInput): Promise<Enterprise>;
    findPhaseById(phaseId: number): Promise<Phase | null>;
    findAllPhasesWithTasks(): Promise<Phase[]>;
    findTaskById(taskId: number): Promise<Task | null>;
    associateTasksToEnterprise(enterpriseId: number, taskIds: number[]): Promise<void>;
    linkUserToEnterprise(userId: number, enterpriseId: number): Promise<ContractInterest>;
    findByUserId(userId: number): Promise<Enterprise[]>;
    findInterestById(interestId: string): Promise<ContractInterest | null>;
    updateInterestStatus(interestId: string, status: InterestStatus): Promise<ContractInterest>;
    removeOtherInterests(enterpriseId: number, approvedInterestId: string): Promise<void>;
    findWithInterests(): Promise<Enterprise[]>;
}
//# sourceMappingURL=enterprise-repository.d.ts.map