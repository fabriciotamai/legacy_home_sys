import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Phase, Task } from '@prisma/client';

interface CreateEnterpriseInput {
  name: string;
  description: string;
  investmentType: 'MONEY' | 'PROPERTY';
  isAvailable: boolean;
  constructionType: string;
  fundingAmount: number;
  transferAmount: number;
  postalCode: string;
  city: string;
  squareMeterValue: number;
  area: number;
  floors?: number;
  completionDate?: Date;
}

interface CreateEnterpriseOutput {
  message: string;
  enterprise: {
    id: number;
    name: string;
    description: string;
    status: string;
    isAvailable: boolean;
    investmentType: string;
    constructionType: string;
    fundingAmount: number;
    transferAmount: number;
    postalCode: string;
    city: string;
    squareMeterValue: number;
    area: number;
    progress: number;
    floors?: number | null;
    completionDate?: Date | null;
    currentPhaseId: number | null;
    currentTaskId: number | null;
    createdAt: Date;
    updatedAt: Date;
    currentPhase: {
      phaseId: number;
      phaseName: string;
      description: string;
      progress: number;
      tasks: {
        taskId: number;
        taskName: string;
        isCompleted: boolean;
      }[];
    };
    currentTask?: {
      taskId: number;
      taskName: string;
      isCompleted: boolean;
    };
  };
}

export class CreateEnterpriseUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: CreateEnterpriseInput): Promise<CreateEnterpriseOutput> {
    const {
      name,
      description,
      investmentType,
      isAvailable,
      constructionType,
      fundingAmount,
      transferAmount,
      postalCode,
      city,
      squareMeterValue,
      area,
      floors,
      completionDate,
    } = input;

    this.validateInput(input);

    const existingEnterprise = await this.enterpriseRepository.findByName(name);
    if (existingEnterprise) {
      throw new Error('Já existe um empreendimento com esse nome.');
    }

    const enterprise = await this.enterpriseRepository.create({
      name,
      description,
      investmentType,
      isAvailable,
      status: 'NEW',
      constructionType,
      fundingAmount,
      transferAmount,
      postalCode,
      city,
      squareMeterValue,
      area,
      floors: floors ?? null,
      completionDate: completionDate ?? null,
    });

    if (!enterprise) {
      throw new Error('Erro ao criar o empreendimento.');
    }

    const phaseTemplates = await this.enterpriseRepository.findAllPhasesWithTasks();
    if (!phaseTemplates || phaseTemplates.length === 0) {
      throw new Error('Nenhuma fase padrão encontrada.');
    }

    await this.initializePhasesAndTasks(enterprise.id, phaseTemplates);

    const initialPhase = phaseTemplates.find((template) => template.order === 1);
    if (!initialPhase) {
      throw new Error('Fase inicial (ordem 1) não encontrada.');
    }

    const firstTask = initialPhase.tasks[0];
    if (!firstTask) {
      throw new Error('Nenhuma tarefa encontrada na fase inicial.');
    }

    const updatedEnterprise = await this.enterpriseRepository.updateEnterprisePhaseAndTask(
      enterprise.id,
      initialPhase.id,
      firstTask.id,
    );

    return {
      message: 'Empreendimento criado com sucesso.',
      enterprise: {
        id: updatedEnterprise.id,
        name: updatedEnterprise.name,
        description: updatedEnterprise.description,
        status: updatedEnterprise.status,
        isAvailable: updatedEnterprise.isAvailable,
        investmentType: updatedEnterprise.investmentType,
        constructionType: updatedEnterprise.constructionType,
        fundingAmount: updatedEnterprise.fundingAmount,
        transferAmount: updatedEnterprise.transferAmount,
        postalCode: updatedEnterprise.postalCode,
        city: updatedEnterprise.city,
        squareMeterValue: updatedEnterprise.squareMeterValue,
        area: updatedEnterprise.area,
        progress: updatedEnterprise.progress,
        floors: updatedEnterprise.floors,
        completionDate: updatedEnterprise.completionDate,
        currentPhaseId: updatedEnterprise.currentPhaseId,
        currentTaskId: updatedEnterprise.currentTaskId,
        createdAt: updatedEnterprise.createdAt,
        updatedAt: updatedEnterprise.updatedAt,
        currentPhase: {
          phaseId: initialPhase.id,
          phaseName: initialPhase.phaseName,
          description: initialPhase.description,
          progress: 0,
          tasks: [
            {
              taskId: firstTask.id,
              taskName: firstTask.taskName,
              isCompleted: false,
            },
          ],
        },
      },
    };
  }

  private validateInput(input: CreateEnterpriseInput): void {
    const { name, description, investmentType, fundingAmount, area } = input;

    if (!name || !description) {
      throw new Error('Nome e descrição são obrigatórios.');
    }

    if (!['MONEY', 'PROPERTY'].includes(investmentType)) {
      throw new Error('Tipo de investimento inválido.');
    }

    if (fundingAmount <= 0 || area <= 0) {
      throw new Error('O valor de aporte e a metragem devem ser maiores que zero.');
    }
  }

  private async initializePhasesAndTasks(enterpriseId: number, phases: (Phase & { tasks: Task[] })[]): Promise<void> {
    for (const phase of phases) {
      await this.enterpriseRepository.createPhaseProgress({
        enterpriseId,
        phaseId: phase.id,
        progress: 0,
      });

      for (const task of phase.tasks) {
        await this.enterpriseRepository.createTaskProgress({
          enterpriseId,
          taskId: task.id,
          isCompleted: false,
        });
      }
    }
  }
}
