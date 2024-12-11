
import { prisma } from '@/lib/prisma';
import {
  ContractInterest,
  Enterprise,
  EnterpriseStatus,
  Phase,
  Prisma,
  Task
} from '@prisma/client';
import { EnterpriseRepository } from '../enterprise-repository';

export class PrismaEnterpriseRepository implements EnterpriseRepository {
  async findById(enterpriseId: number): Promise<Enterprise | null> {
    return await prisma.enterprise.findUnique({
      where: { id: enterpriseId },
      include: {
        currentPhase: true,
        currentTask: true,
      },
    });
  }

  
  async findByName(name: string): Promise<Enterprise | null> {
    return await prisma.enterprise.findFirst({
      where: { name },
    });
  }

  
  async findAll(filters: {
    status?: EnterpriseStatus;
    investmentType?: 'MONEY' | 'PROPERTY';
    isAvailable?: boolean;
  }): Promise<Enterprise[]> {
    const { status, investmentType, isAvailable } = filters;

    return await prisma.enterprise.findMany({
      where: {
        status: status || undefined,
        investmentType: investmentType || undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined,
      },
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
    return await prisma.contractInterest.create({
      data: {
        userId,
        enterpriseId,
        status: 'PENDING', 
      },
    });
  }
  async create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise> {
    return await prisma.enterprise.create({ data });
  }

  async update(
    enterpriseId: number,
    data: Prisma.EnterpriseUpdateInput
  ): Promise<Enterprise> {
    return await prisma.enterprise.update({
      where: { id: enterpriseId },
      data,
    });
  }

  async findPhaseById(phaseId: number): Promise<Phase | null> {
    return await prisma.phase.findUnique({
      where: { id: phaseId },
      include: { tasks: true },
    });
  }

  async findAllPhasesWithTasks(): Promise<Phase[]> {
    return await prisma.phase.findMany({
      include: { tasks: true },
    });
  }
  
  async findTaskById(taskId: number): Promise<Task | null> {
    return await prisma.task.findUnique({
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

  async findByUserId(userId: number): Promise<Enterprise[]> {
    return await prisma.enterprise.findMany({
      where: {
        OR: [
          {
            contracts: {
              some: {
                userId,
              },
            },
          },
          {
            contractInterests: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        currentPhase: true,
        currentTask: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  
}
