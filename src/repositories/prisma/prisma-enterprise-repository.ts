import { prisma } from '@/lib/prisma';
import { EnterpriseWithRelations } from '@/types';
import {
  ContractInterest,
  Enterprise,
  EnterpriseImage,
  EnterpriseStatus,
  EnterpriseTaskStatus,
  InterestStatus,
  Investment,
  Phase,
  Prisma,
  Task,
} from '@prisma/client';
import { EnterpriseRepository } from '../enterprise-repository';

export class PrismaEnterpriseRepository implements EnterpriseRepository {
  
  
  async findById(enterpriseId: number, tx?: Prisma.TransactionClient): Promise<Enterprise> {
    return (tx ?? prisma).enterprise.findUniqueOrThrow({
      where: { id: enterpriseId },
      include: { currentPhase: true, currentTask: true },
    });
  }

  async findPhasesByEnterprise(
    enterpriseId: number,
  ): Promise<{ phaseId: number; progress: number }[]> {
    return prisma.enterprisePhaseStatus.findMany({
      where: { enterpriseId },
      select: {
        phaseId: true,
        progress: true,
      },
    });
  }




  async findPhaseWithTasks(
    phaseId: number,
  ): Promise<(Phase & { tasks: Task[] }) | null> {
    return prisma.phase.findUnique({
      where: { id: phaseId },
      include: {
        tasks: true,
      },
    });
  }

  async findTasksInPhaseByEnterprise(
    enterpriseId: number,
    phaseId: number,
  ): Promise<(EnterpriseTaskStatus & { task: Task })[]> {
    return prisma.enterpriseTaskStatus.findMany({
      where: {
        enterpriseId,
        task: { phaseId },
      },
      include: {
        task: true,
      },
    });
  }

  async findTaskWithPhaseAndEnterprise(
    enterpriseId: number,
    taskId: number,
  ): Promise<(Task & { phase: Phase }) | null> {
    const taskStatus = await prisma.enterpriseTaskStatus.findFirst({
      where: {
        enterpriseId,
        taskId,
      },
      include: {
        task: {
          include: {
            phase: true,
          },
        },
      },
    });

    return taskStatus ? taskStatus.task : null;
  }
  async addInterestLog(data: {
    userId: number;
    enterpriseId: number;
    interestId: string;
    status: InterestStatus;
    reason?: string;
  }, tx?: Prisma.TransactionClient): Promise<void> {
    await (tx ?? prisma).interestLog.create({
      data: {
        userId: data.userId,
        enterpriseId: data.enterpriseId,
        interestId: data.interestId,
        status: data.status,
        reason: data.reason,
      },
    });
  }


  async addInvestment(data: {
    userId: number;
    enterpriseId: number;
    investedAmount: number;
  }, tx?: Prisma.TransactionClient): Promise<void> {
    await (tx ?? prisma).investment.create({
      data: {
        userId: data.userId,
        enterpriseId: data.enterpriseId,
        investedAmount: data.investedAmount,
      },
    });
  }

  async findByName(name: string): Promise<Enterprise | null> {
    return prisma.enterprise.findFirst({
      where: { name },
    });
  }

  async findAll(filters: {
    status?: EnterpriseStatus;
    investmentType?: 'MONEY' | 'PROPERTY';
    isAvailable?: boolean;
  }): Promise<EnterpriseWithRelations[]> {
    const where: Prisma.EnterpriseWhereInput = {};

    if (filters.status !== undefined) where.status = filters.status;
    if (filters.investmentType !== undefined)
      where.investmentType = filters.investmentType;
    if (filters.isAvailable !== undefined)
      where.isAvailable = filters.isAvailable;

    return prisma.enterprise.findMany({
      where,
      include: {
        currentPhase: true,
        currentTask: true,
        contractInterests: true,
        investments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise> {
    return prisma.enterprise.create({ data });
  }

  async createMany(enterpriseId: number, imageUrls: string[]): Promise<void> {
    await prisma.enterpriseImage.createMany({
      data: imageUrls.map(url => ({
        enterpriseId,
        imageUrl: url,
      })),
    });
  }

  async findByEnterpriseId(enterpriseId: number): Promise<EnterpriseImage[]> {
    return prisma.enterpriseImage.findMany({
      where: { enterpriseId },
    });
  }

  async deleteAllByEnterpriseId(enterpriseId: number): Promise<void> {
    await prisma.enterpriseImage.deleteMany({
      where: { enterpriseId },
    });
  }

  async update(
    enterpriseId: number,
    data: Prisma.EnterpriseUpdateInput,
  ): Promise<Enterprise> {
    return prisma.enterprise.update({
      where: { id: enterpriseId },
      data,
    });
  }

  async updateEnterpriseProgress(
    enterpriseId: number,
    progress: number,
  ): Promise<void> {
    await prisma.enterprise.update({
      where: { id: enterpriseId },
      data: { progress },
    });
  }

  async initializeEnterprisePhasesAndTasks(
    enterpriseId: number,
  ): Promise<void> {
    const phases = await prisma.phase.findMany({
      include: { tasks: true },
    });

    await prisma.$transaction(async (tx) => {
      for (const phase of phases) {
        await tx.enterprisePhaseStatus.create({
          data: { enterpriseId, phaseId: phase.id, progress: 0 },
        });

        await tx.enterpriseTaskStatus.createMany({
          data: phase.tasks.map((task) => ({
            enterpriseId,
            taskId: task.id,
            isCompleted: false,
          })),
        });
      }
    });
  }


  async linkUserToEnterprise(
    userId: number,
    enterpriseId: number,
    status: InterestStatus = InterestStatus.PENDING,
    tx?: Prisma.TransactionClient, 
  ): Promise<ContractInterest> {
    return (tx ?? prisma).contractInterest.create({
      data: {
        userId,
        enterpriseId,
        status,
      },
    });
  }

  async findInterestById(interestId: string): Promise<ContractInterest | null> {
    return prisma.contractInterest.findUnique({
      where: { interestId },
    });
  }


  async updateInterestStatus(
    interestId: string,
    status: InterestStatus,
    tx?: Prisma.TransactionClient, // ADICIONADO
  ): Promise<ContractInterest> {
    return (tx ?? prisma).contractInterest.update({
      where: { interestId },
      data: { status }, // CORRIGIDO para usar status diretamente
    });
  }

  // Já estava ajustado para aceitar 'tx'
  async removeOtherInterests(
    enterpriseId: number,
    interestId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await (tx ?? prisma).contractInterest.updateMany({
      where: {
        enterpriseId: enterpriseId,
        interestId: { not: interestId },
      },
      data: {
        status: 'REJECTED',
      },
    });
  }

  async findWithInterests(): Promise<Enterprise[]> {
    return prisma.enterprise.findMany({
      where: {
        contractInterests: {
          some: {
            status: 'PENDING',
          },
        },
      },
      include: {
        contractInterests: {
          where: {
            status: 'PENDING',
          },
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: number): Promise<(Enterprise & { contractInterests: { status: string }[] })[]> {
    return prisma.enterprise.findMany({
      where: {
        OR: [
          { contracts: { some: { userId } } },
          { contractInterests: { some: { userId } } },
        ],
      },
      include: {
        currentPhase: true,
        currentTask: true,
        contractInterests: {
          where: { userId },
          select: { status: true },
          take: 1, 
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addChangeLog(data: {
    enterpriseId: number;
    changeType: 'STATUS_CHANGED' | 'PHASE_CHANGED' | 'TASK_CHANGED';
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await prisma.enterpriseChangeLog.create({
      data: {
        enterpriseId: data.enterpriseId,
        changeType: data.changeType,
        description: data.description,
        metadata: (data.metadata as Prisma.InputJsonValue) || undefined,
      },
    });
  }

  async updateEnterprisePhaseAndTask(
    enterpriseId: number,
    phaseId: number,
    taskId?: number,
  ): Promise<Enterprise> {
    return prisma.enterprise.update({
      where: { id: enterpriseId },
      data: {
        currentPhaseId: phaseId,
        currentTaskId: taskId || null,
      },
      include: {
        currentPhase: true,
        currentTask: true,
      },
    });
  }

  async findPhaseById(phaseId: number): Promise<Phase | null> {
    return prisma.phase.findUnique({
      where: { id: phaseId },
      include: { tasks: true },
    });
  }

  async findAllPhasesWithTasks(): Promise<(Phase & { tasks: Task[] })[]> {
    return prisma.phase.findMany({
      include: { tasks: true },
    });
  }

  async findAllPhasesByEnterprise(
    enterpriseId: number,
  ): Promise<(Phase & { tasks: Task[] })[]> {
    return prisma.phase.findMany({
      where: {
        enterprises: { some: { id: enterpriseId } },
      },
      include: { tasks: true },
    });
  }

  // Adicionado o parâmetro opcional 'tx'
  async updatePhaseProgress(
    enterpriseId: number,
    phaseId: number,
    progress: number,
    tx?: Prisma.TransactionClient, // ADICIONADO
  ): Promise<void> {
    await (tx ?? prisma).enterprisePhaseStatus.update({
      where: {
        enterpriseId_phaseId: {
          enterpriseId,
          phaseId,
        },
      },
      data: { progress },
    });
  }

  async createPhase(data: Prisma.PhaseCreateInput): Promise<Phase> {
    return prisma.phase.create({ data });
  }

  async findTaskById(taskId: number): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  async findTaskWithPhase(
    taskId: number,
  ): Promise<(Task & { phase: Phase }) | null> {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: { phase: true },
    });
  }

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  // Adicionado o parâmetro opcional 'tx'
  async associateTasksToEnterprise(
    enterpriseId: number,
    taskIds: number[],
    tx?: Prisma.TransactionClient, // ADICIONADO
  ): Promise<void> {
    const updates = taskIds.map((taskId) =>
      (tx ?? prisma).enterpriseTaskStatus.create({
        data: {
          enterpriseId,
          taskId,
          isCompleted: false,
        },
      }),
    );

    await Promise.all(updates);
  }

  // Adicionado o parâmetro opcional 'tx'
  async updateTaskStatus(
    enterpriseId: number,
    taskId: number,
    isCompleted: boolean,
    tx?: Prisma.TransactionClient, // ADICIONADO
  ): Promise<void> {
    await (tx ?? prisma).enterpriseTaskStatus.updateMany({
      where: {
        enterpriseId,
        taskId,
      },
      data: { isCompleted },
    });
  }

  // Adicionado o parâmetro opcional 'tx'
  async createPhaseProgress(data: {
    enterpriseId: number;
    phaseId: number;
    progress: number;
  }, tx?: Prisma.TransactionClient): Promise<void> { // ADICIONADO
    await (tx ?? prisma).enterprisePhaseStatus.create({
      data: {
        enterpriseId: data.enterpriseId,
        phaseId: data.phaseId,
        progress: data.progress,
      },
    });
  }

  async findSingleInvestmentByEnterpriseId(
    enterpriseId: number,
  ): Promise<Investment | null> {
    return prisma.investment.findFirst({
      where: { enterpriseId },
    });
  }

  // Adicionado o parâmetro opcional 'tx'
  async createTaskProgress(data: {
    enterpriseId: number;
    taskId: number;
    isCompleted: boolean;
  }, tx?: Prisma.TransactionClient): Promise<void> { // ADICIONADO
    await (tx ?? prisma).enterpriseTaskStatus.create({
      data: {
        enterpriseId: data.enterpriseId,
        taskId: data.taskId,
        isCompleted: data.isCompleted,
      },
    });
  }
}
