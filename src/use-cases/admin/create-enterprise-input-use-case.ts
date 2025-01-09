import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { ConstructionType, InvestmentType, Phase, Task } from '@prisma/client';



interface CreateEnterpriseInput {
  name: string;
  corporateName: string;
  address: string;
  description: string;
  investmentType: InvestmentType;
  isAvailable: boolean;
  constructionType: ConstructionType;
  fundingAmount: number;
  transferAmount: number;
  postalCode: string;
  city: string;
  squareMeterValue: number;
  area: number;
  floors?: number;
  completionDate?: Date;
  coverImageUrl?: string; 
  imageUrls?: string[]; 
}

interface CreateEnterpriseOutput {
  message: string;
  enterprise: {
    id: number;
    name: string;
    corporateName: string;
    address: string;
    description: string;
    status: string;
    isAvailable: boolean;
    investmentType: InvestmentType;
    constructionType: ConstructionType;
    fundingAmount: number;
    transferAmount: number;
    postalCode: string;
    city: string;
    squareMeterValue: number;
    area: number;
    progress: number;
    floors?: number | null;
    completionDate?: Date | null;
    coverImageUrl?: string | null;
    imageUrls: string[];
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
      corporateName,
      address,
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
      coverImageUrl,
      imageUrls = [],
    } = input;

    this.validateInput(input);

    if (imageUrls.length > 5) {
      throw new Error('No máximo 5 imagens podem ser anexadas na criação.');
    }

    const existingEnterprise = await this.enterpriseRepository.findByName(name);
    if (existingEnterprise) {
      throw new Error('Já existe um empreendimento com esse nome.');
    }

    // Se não houver coverImageUrl, a primeira imagem do imageUrls é usada como capa
    const finalCoverImageUrl = coverImageUrl ?? imageUrls[0] ?? null;

    // 🔹 Criando o empreendimento no banco
    const enterprise = await this.enterpriseRepository.create({
      name,
      corporateName,
      address,
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
      coverImageUrl: finalCoverImageUrl, // Define corretamente a imagem de capa
    });

    if (!enterprise) {
      throw new Error('Erro ao criar o empreendimento.');
    }

    // 🔹 Se houver imagens extras, associamos ao empreendimento
    if (imageUrls.length > 0) {
      await this.enterpriseRepository.createMany(enterprise.id, imageUrls);
    }

    // 🔹 Recuperando as imagens do banco para enviar na resposta
    const storedImages = await this.enterpriseRepository.findByEnterpriseId(enterprise.id);

    // 🔹 Inicializando fases e tarefas do empreendimento
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

    // 🔹 Atualizando o empreendimento com a fase e tarefa iniciais
    const updatedEnterprise =
      await this.enterpriseRepository.updateEnterprisePhaseAndTask(
        enterprise.id,
        initialPhase.id,
        firstTask.id,
      );

    return {
      message: 'Empreendimento criado com sucesso.',
      enterprise: {
        id: updatedEnterprise.id,
        name: updatedEnterprise.name,
        corporateName: updatedEnterprise.corporateName,
        address: updatedEnterprise.address,
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
        coverImageUrl: updatedEnterprise.coverImageUrl,
        imageUrls: storedImages, // 🔹 Agora retorna corretamente os URLs das imagens
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
    const { name, description, fundingAmount, area, corporateName, address } = input;

    if (!name || !description || !corporateName || !address) {
      throw new Error('Nome, descrição, razão social e endereço são obrigatórios.');
    }

    if (fundingAmount <= 0 || area <= 0) {
      throw new Error('O valor de aporte e a metragem devem ser maiores que zero.');
    }
  }

  private async initializePhasesAndTasks(
    enterpriseId: number,
    phases: (Phase & { tasks: Task[] })[],
  ): Promise<void> {
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
