import { ContractInterest, Enterprise, EnterpriseStatus, InterestStatus, Phase, Prisma, Task } from '@prisma/client';
import { EnterpriseRepository } from '../enterprise-repository';
export declare class PrismaEnterpriseRepository implements EnterpriseRepository {
    findById(enterpriseId: number): Promise<Enterprise | null>;
    findByName(name: string): Promise<Enterprise | null>;
    findWithInterests(): Promise<Enterprise[]>;
    findInterestById(interestId: string): Promise<ContractInterest | null>;
    removeOtherInterests(enterpriseId: number, approvedInterestId: string): Promise<void>;
    updateInterestStatus(interestId: string, status: InterestStatus): Promise<ContractInterest>;
    findAll(filters: {
        status?: EnterpriseStatus;
        investmentType?: 'MONEY' | 'PROPERTY';
        isAvailable?: boolean;
    }): Promise<Enterprise[]>;
    linkUserToEnterprise(userId: number, enterpriseId: number): Promise<ContractInterest>;
    create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>;
    update(enterpriseId: number, data: Prisma.EnterpriseUpdateInput): Promise<Enterprise>;
    findPhaseById(phaseId: number): Promise<Phase | null>;
    findAllPhasesWithTasks(): Promise<Phase[]>;
    findTaskById(taskId: number): Promise<Task | null>;
    associateTasksToEnterprise(enterpriseId: number, taskIds: number[]): Promise<void>;
    findByUserId(userId: number): Promise<(Enterprise & {
        interestStatus?: string;
    })[]>;
}
//# sourceMappingURL=prisma-enterprise-repository.d.ts.map