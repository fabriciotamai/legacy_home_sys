import { prisma } from '@/lib/prisma';
import {
  ContractInterest,
  Enterprise,
  EnterpriseStatus,
  InterestStatus,
  Phase,
  Prisma,
  Task
} from '@prisma/client';
import { EnterpriseRepository } from '../enterprise-repository';

type PhaseProgress = {
  id: number;
  progress: number;
};





import { PhaseWithEnterpriseAndTasks } from '../../types';

export class PrismaEnterpriseRepository implements EnterpriseRepository {
  async findById(enterpriseId: number): Promise<Enterprise | null> {
    return prisma.enterprise.findUnique({
      where: { id: enterpriseId },
      include: {
        currentPhase: true,
        currentTask: true,
      },
    });
  }

  async findByName(name: string): Promise<Enterprise | null> {
    return prisma.enterprise.findFirst({
      where: { name },
    });
  }

  async findWithInterests(): Promise<Enterprise[]> {
    return prisma.enterprise.findMany({
      where: {
        contractInterests: { some: {} },
      },
      include: {
        contractInterests: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findInterestById(interestId: string): Promise<ContractInterest | null> {
    return prisma.contractInterest.findUnique({
      where: { interestId },
    });
  }

  async removeOtherInterests(
    enterpriseId: number, 
    approvedInterestId: string
  ): Promise<void> {
    await prisma.contractInterest.deleteMany({
      where: {
        enterpriseId,
        interestId: {
          not: approvedInterestId,
        },
      },
    });
  }

  async updateInterestStatus(
    interestId: string,
    status: InterestStatus
  ): Promise<ContractInterest> {
    return prisma.contractInterest.update({
      where: { interestId },
      data: { status },
    });
  }

  async findPhaseWithTasks(phaseId: number): Promise<PhaseWithEnterpriseAndTasks | null> {
    return prisma.phase.findUnique({
      where: { id: phaseId },
      include: {
        tasks: true,
        Enterprise: true,
      },
    });
  }

  async findPhasesByEnterprise(enterpriseId: number): Promise<PhaseProgress[]> {
    return prisma.phase.findMany({
      where: {
        Enterprise: { some: { id: enterpriseId } },
      },
      select: {
        id: true,
        progress: true,
      },
    });
  }

  async findEnterpriseProgress(
    enterpriseId: number
  ): Promise<{ id: number; progress: number } | null> {
    return prisma.enterprise.findUnique({
      where: { id: enterpriseId },
      select: {
        id: true,
        progress: true,
      },
    });
  }

  async findAllPhasesByEnterprise(enterpriseId: number): Promise<Phase[]> {
    return prisma.phase.findMany({
      where: {
        Enterprise: { some: { id: enterpriseId } }
      },
      include: { tasks: true, Enterprise: true },
      orderBy: { order: 'asc' }
    });
  }

  async updatePhaseProgress(phaseId: number, progress: number): Promise<void> {
    await prisma.phase.update({
      where: { id: phaseId },
      data: { progress },
    });
  }

  async findAll(filters: {
    status?: EnterpriseStatus;
    investmentType?: 'MONEY' | 'PROPERTY';
    isAvailable?: boolean;
  }): Promise<Enterprise[]> {
    const { status, investmentType, isAvailable } = filters;
    const where: Prisma.EnterpriseWhereInput = {};

    if (status !== undefined) where.status = status;
    if (investmentType !== undefined) where.investmentType = investmentType;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;

    return prisma.enterprise.findMany({
      where,
      include: {
        currentPhase: true,
        currentTask: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async linkUserToEnterprise(
    userId: number,
    enterpriseId: number
  ): Promise<ContractInterest> {
    return prisma.contractInterest.create({
      data: {
        userId,
        enterpriseId,
        status: 'PENDING',
      },
    });
  }

  async create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise> {
    return prisma.enterprise.create({ data });
  }

  async update(
    enterpriseId: number,
    data: Prisma.EnterpriseUpdateInput
  ): Promise<Enterprise> {
    return prisma.enterprise.update({
      where: { id: enterpriseId },
      data,
    });
  }

  async findPhaseById(phaseId: number): Promise<Phase | null> {
    return prisma.phase.findUnique({
      where: { id: phaseId },
      include: { tasks: true },
    });
  }

  async findAllPhasesWithTasks(): Promise<Phase[]> {
    return prisma.phase.findMany({
      include: { tasks: true },
    });
  }

  async findTaskById(taskId: number): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  async associateTasksToEnterprise(
    enterpriseId: number,
    taskIds: number[]
  ): Promise<void> {
    for (const taskId of taskIds) {
      await prisma.enterpriseTaskStatus.create({
        data: {
          enterpriseId,
          taskId,
          isCompleted: false,
        },
      });
    }
  }

  async updateEnterpriseProgress(enterpriseId: number, progress: number): Promise<void> {
    await prisma.enterprise.update({
      where: { id: enterpriseId },
      data: { progress },
    });
  }

  async updateTaskStatus(taskId: number, isCompleted: boolean): Promise<void> {
    await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted },
    });
  }

  async findByUserId(userId: number): Promise<(Enterprise & { interestStatus?: string })[]> {
    const enterprises = await prisma.enterprise.findMany({
      where: {
        OR: [
          {
            contracts: { some: { userId } },
          },
          {
            contractInterests: { some: { userId } },
          },
        ],
      },
      include: {
        currentPhase: true,
        currentTask: true,
        contractInterests: {
          where: { userId },
          select: { status: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return enterprises.map((enterprise) => {
      const interestStatus = enterprise.contractInterests[0]?.status ?? undefined;
      const { contractInterests, ...rest } = enterprise;
      return {
        ...rest,
        interestStatus,
      };
    });
  }
}
