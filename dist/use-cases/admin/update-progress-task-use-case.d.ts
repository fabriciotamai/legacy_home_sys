import { EnterpriseRepository } from '@/repositories/enterprise-repository';
interface UpdateTaskStatusInput {
    enterpriseId: number;
    phaseId: number;
    taskId: number;
    isCompleted: boolean;
}
export declare class UpdateProgressUseCase {
    private readonly enterpriseRepository;
    constructor(enterpriseRepository: EnterpriseRepository);
    execute(input: UpdateTaskStatusInput): Promise<void>;
    private recalculatePhaseProgress;
    private recalculateEnterpriseProgress;
    private moveToNextTaskOrPhase;
    private moveToPreviousTaskAndReset;
}
export {};
//# sourceMappingURL=update-progress-task-use-case.d.ts.map