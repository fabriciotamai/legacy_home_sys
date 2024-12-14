import { Enterprise, Phase, Task } from '@prisma/client';
export type PhaseWithEnterpriseAndTasks = Phase & {
    tasks: Task[];
    enterprise: Enterprise;
};
//# sourceMappingURL=types.d.ts.map