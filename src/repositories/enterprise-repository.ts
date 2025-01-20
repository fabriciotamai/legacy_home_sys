import { EnterpriseWithContractInterests, EnterpriseWithRelations } from '@/types';
import {
  ContractInterest,
  Enterprise,
  EnterpriseStatus,
  EnterpriseTaskStatus,
  InterestStatus,
  Investment,
  Phase,
  Prisma,
  Task
} from '@prisma/client';

interface FindAllFilters {
  status?: EnterpriseStatus;
  investmentType?: 'MONEY' | 'PROPERTY';
  isAvailable?: boolean;
}
export interface EnterpriseRepository {
  findById(enterpriseId: number, tx?: Prisma.TransactionClient): Promise<Enterprise>;
  findByName(name: string): Promise<Enterprise | null>;
  findAll(filters: FindAllFilters): Promise<EnterpriseWithRelations[]>;
  create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>;
  update(
    enterpriseId: number,
    data: Prisma.EnterpriseUpdateInput,
  ): Promise<Enterprise>;
  updateEnterprisePhaseAndTask(
    enterpriseId: number,
    phaseId: number,
    taskId?: number,
  ): Promise<Enterprise>;
  updateEnterpriseProgress(
    enterpriseId: number,
    progress: number,
  ): Promise<void>;
  findWithInterests(): Promise<Enterprise[]>;
  findByUserId(userId: number): Promise<EnterpriseWithContractInterests[]>;
  initializeEnterprisePhasesAndTasks(enterpriseId: number): Promise<void>;
  linkUserToEnterprise(userId: number, enterpriseId: number, status: InterestStatus, tx?: Prisma.TransactionClient): Promise<ContractInterest>;
  findInterestById(interestId: string): Promise<ContractInterest | null>;
  updateInterestStatus(
    interestId: string,
    status: InterestStatus,
  ): Promise<ContractInterest>;
  removeOtherInterests(enterpriseId: number, interestId: string, tx?: Prisma.TransactionClient): Promise<void>;
  findPhaseById(phaseId: number): Promise<Phase | null>;
  findAllPhasesWithTasks(): Promise<(Phase & { tasks: Task[] })[]>;
  findAllPhasesByEnterprise(
    enterpriseId: number,
  ): Promise<(Phase & { tasks: Task[] })[]>;
  findPhasesByEnterprise(
    enterpriseId: number,
  ): Promise<{ phaseId: number; progress: number }[]>;
  updatePhaseProgress(
    enterpriseId: number,
    phaseId: number,
    progress: number,
  ): Promise<void>;
  createPhase(data: Prisma.PhaseCreateInput): Promise<Phase>;
  findTaskById(taskId: number): Promise<Task | null>;
  findTaskWithPhase(taskId: number): Promise<(Task & { phase: Phase }) | null>;
  createTask(data: Prisma.TaskCreateInput): Promise<Task>;
  associateTasksToEnterprise(
    enterpriseId: number,
    taskIds: number[],
  ): Promise<void>;
  updateTaskStatus(
    enterpriseId: number,
    taskId: number,
    isCompleted: boolean,
  ): Promise<void>;
  findTasksInPhaseByEnterprise(
    enterpriseId: number,
    phaseId: number,
  ): Promise<(EnterpriseTaskStatus & { task: Task })[]>;
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
  findPhaseWithTasks(
    phaseId: number,
  ): Promise<(Phase & { tasks: Task[] }) | null>;
  findTaskWithPhaseAndEnterprise(
    enterpriseId: number,
    taskId: number,
  ): Promise<(Task & { phase: Phase }) | null>;
  addInvestment(data: { userId: number; enterpriseId: number; investedAmount: number }, tx?: Prisma.TransactionClient): Promise<void>;
  addInterestLog(data: { userId: number; enterpriseId: number; interestId: string; status: InterestStatus; reason?: string }, tx?: Prisma.TransactionClient): Promise<void>;
  addChangeLog(data: {
    enterpriseId: number;
    changeType: 'STATUS_CHANGED' | 'PHASE_CHANGED' | 'TASK_CHANGED';
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
  findSingleInvestmentByEnterpriseId(
    enterpriseId: number,
  ): Promise<Investment | null>;
  createMany(enterpriseId: number, imageUrls: string[]): Promise<void>;
  findByEnterpriseId(enterpriseId: number): Promise<string[]>;
  deleteAllByEnterpriseId(enterpriseId: number): Promise<void>;
  findImageUrlsByEnterpriseId(
    enterpriseId: number,
    skip?: number,
    take?: number
  ): Promise<string[]>;
  countImagesByEnterpriseId(enterpriseId: number): Promise<number>;
  getPaginatedImageUrlsByEnterpriseId(
    enterpriseId: number,
    page: number,
    limit: number
  ): Promise<{ images: string[]; total: number }>;
  deleteEnterprise(enterpriseId: number): Promise<void>;
  findInvestmentsByEnterpriseId(enterpriseId: number): Promise<Investment[]>;
  deleteImagesByEnterprise(enterpriseId: number, imageUrls: string[]): Promise<void>;
  findApprovedInterestByUserAndEnterprise(
    userId: number,
    enterpriseId: number
  ): Promise<ContractInterest | null>;
}
