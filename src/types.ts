import {
  ContractInterest,
  Enterprise,
  Phase,
  Prisma,
  Task,
} from '@prisma/client';

export type PhaseWithEnterpriseAndTasks = Phase & {
  tasks: Task[];
  enterprise: Enterprise;
};

export type PrismaUserWithAddress = Prisma.UserGetPayload<{
  include: { address: true };
}>;

export type EnterpriseWithRelations = Prisma.EnterpriseGetPayload<{
  include: {
    currentPhase: true;
    currentTask: true;
    contractInterests: true;
    investments: true;
  };
}>;

export type SimplifiedEnterpriseWithRelations = Enterprise & {
  currentPhase?: {
    id: number;
    phaseName: string;
    description: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  };
  currentTask?: {
    id: number;
    taskName: string;
    description: string;
    phaseId: number;
    createdAt: Date;
    updatedAt: Date;
  };
  contractInterests: { status: ContractInterest['status'] }[];
};
