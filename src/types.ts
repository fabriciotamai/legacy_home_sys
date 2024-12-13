// types.ts
import { Enterprise, Phase, Task } from '@prisma/client';

export type PhaseWithEnterpriseAndTasks = Phase & {
  tasks: Task[];
  Enterprise: Enterprise[];
};
