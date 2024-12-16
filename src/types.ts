// types.ts
import { Enterprise, Phase, Prisma, Task } from '@prisma/client';

export type PhaseWithEnterpriseAndTasks = Phase & {
  tasks: Task[];
  enterprise: Enterprise;
};

export type PrismaUserWithAddress = Prisma.UserGetPayload<{ include: { addresses: true } }>;
