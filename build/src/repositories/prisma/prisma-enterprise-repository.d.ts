import { EnterpriseWithRelations } from '@/types';
import { ContractInterest, Enterprise, EnterpriseStatus, EnterpriseTaskStatus, InterestStatus, Phase, Prisma, Task } from '@prisma/client';
import { EnterpriseRepository } from '../enterprise-repository';
export declare class PrismaEnterpriseRepository implements EnterpriseRepository {
    findById(enterpriseId: number): Promise<Enterprise | null>;
    findPhasesByEnterprise(enterpriseId: number): Promise<{
        phaseId: number;
        progress: number;
    }[]>;
    findPhaseWithTasks(phaseId: number): Promise<(Phase & {
        tasks: Task[];
    }) | null>;
    findTasksInPhaseByEnterprise(enterpriseId: number, phaseId: number): Promise<(EnterpriseTaskStatus & {
        task: Task;
    })[]>;
    findTaskWithPhaseAndEnterprise(enterpriseId: number, taskId: number): Promise<(Task & {
        phase: Phase;
    }) | null>;
    findByName(name: string): Promise<Enterprise | null>;
    findAll(filters: {
        status?: EnterpriseStatus;
        investmentType?: 'MONEY' | 'PROPERTY';
        isAvailable?: boolean;
    }): Promise<EnterpriseWithRelations[]>;
    create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>;
    update(enterpriseId: number, data: Prisma.EnterpriseUpdateInput): Promise<Enterprise>;
    updateEnterpriseProgress(enterpriseId: number, progress: number): Promise<void>;
    initializeEnterprisePhasesAndTasks(enterpriseId: number): Promise<void>;
    linkUserToEnterprise(userId: number, enterpriseId: number): Promise<ContractInterest>;
    findInterestById(interestId: string): Promise<ContractInterest | null>;
    updateInterestStatus(interestId: string, status: InterestStatus): Promise<ContractInterest>;
    removeOtherInterests(enterpriseId: number, approvedInterestId: string): Promise<void>;
    findWithInterests(): Promise<Enterprise[]>;
    findByUserId(userId: number): Promise<(Enterprise & {
        interestStatus?: string;
    })[]>;
    updateEnterprisePhaseAndTask(enterpriseId: number, phaseId: number, taskId?: number): Promise<Enterprise>;
    findPhaseById(phaseId: number): Promise<Phase | null>;
    findAllPhasesWithTasks(): Promise<(Phase & {
        tasks: Task[];
    })[]>;
    findAllPhasesByEnterprise(enterpriseId: number): Promise<(Phase & {
        tasks: Task[];
    })[]>;
    updatePhaseProgress(enterpriseId: number, phaseId: number, progress: number): Promise<void>;
    createPhase(data: Prisma.PhaseCreateInput): Promise<Phase>;
    findTaskById(taskId: number): Promise<Task | null>;
    findTaskWithPhase(taskId: number): Promise<(Task & {
        phase: Phase;
    }) | null>;
    createTask(data: Prisma.TaskCreateInput): Promise<Task>;
    associateTasksToEnterprise(enterpriseId: number, taskIds: number[]): Promise<void>;
    updateTaskStatus(enterpriseId: number, taskId: number, isCompleted: boolean): Promise<void>;
    createPhaseProgress(data: {
        enterpriseId: number;
        phaseId: number;
        progress: number;
    }): Promise<void>;
    createTaskProgress(data: {
        enterpriseId: number;
        taskId: number;
        isCompleted: boolean;
    }): Promise<void>;
}
//# sourceMappingURL=prisma-enterprise-repository.d.ts.map