import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Enterprise } from '@prisma/client';

interface CreateEnterpriseInput {
  name: string;
  description: string;
  investmentType: 'MONEY' | 'PROPERTY';
  isAvailable: boolean;
  currentPhaseId?: number; 
  currentTaskId?: number; 
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

export class CreateEnterpriseUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: CreateEnterpriseInput): Promise<Enterprise> {
    const {
      name,
      description,
      investmentType,
      isAvailable,
      currentPhaseId,
      currentTaskId,
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

    
    if (!name || !description) {
      throw new Error('Nome e descrição são obrigatórios.');
    }

    if (!['MONEY', 'PROPERTY'].includes(investmentType)) {
      throw new Error('Tipo de investimento inválido.');
    }

    if (!constructionType) {
      throw new Error('O tipo de construção é obrigatório.');
    }

    if (fundingAmount <= 0) {
      throw new Error('O valor de aporte deve ser maior que zero.');
    }

    if (area <= 0) {
      throw new Error('A metragem total deve ser maior que zero.');
    }

    
    const existingEnterprise = await this.enterpriseRepository.findByName(name);
    if (existingEnterprise) {
      throw new Error('Já existe um empreendimento com esse nome.');
    }

    
    if (currentPhaseId) {
      const phase = await this.enterpriseRepository.findPhaseById(currentPhaseId);
      if (!phase) {
        throw new Error(`A fase com ID ${currentPhaseId} especificada não existe.`);
      }

      if (currentTaskId) {
        const task = await this.enterpriseRepository.findTaskById(currentTaskId);
        if (!task) {
          throw new Error(`A tarefa com ID ${currentTaskId} especificada não existe.`);
        }

        if (task.phaseId !== currentPhaseId) {
          throw new Error(`A tarefa com ID ${currentTaskId} não pertence à fase especificada.`);
        }
      }
    }

    
    const enterprise = await this.enterpriseRepository.create({
      name,
      description,
      investmentType,
      isAvailable,
      status: 'NEW',
      currentPhase: currentPhaseId ? { connect: { id: currentPhaseId } } : undefined,
      currentTask: currentTaskId ? { connect: { id: currentTaskId } } : undefined,
      constructionType,
      fundingAmount,
      transferAmount,
      postalCode,
      city,
      squareMeterValue,
      area,
      floors,
      completionDate,
    });

    return enterprise;
  }
}
