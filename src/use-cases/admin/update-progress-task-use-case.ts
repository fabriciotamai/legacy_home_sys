import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { EnterpriseStatus } from '@prisma/client';

interface UpdateTaskStatusInput {
  taskId: number;
  isCompleted: boolean;
}

export class UpdateProgressUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: UpdateTaskStatusInput): Promise<void> {
    const { taskId, isCompleted } = input;

    
    const task = await this.enterpriseRepository.findTaskById(taskId);
    if (!task) {
      throw new Error('Tarefa não encontrada.');
    }

    
    await this.enterpriseRepository.updateTaskStatus(taskId, isCompleted);

    
    const phase = await this.enterpriseRepository.findPhaseWithTasks(task.phaseId);
    if (!phase) {
      throw new Error('Fase não encontrada.');
    }

    if (!phase.Enterprise || phase.Enterprise.length === 0) {
      throw new Error('Nenhum empreendimento associado a esta fase.');
    }

    const enterpriseId = phase.Enterprise[0].id;

    
    const totalTasks = phase.tasks.length;
    const completedTasks = phase.tasks.filter((t) => t.isCompleted).length;
    const phaseProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    
    await this.enterpriseRepository.updatePhaseProgress(phase.id, phaseProgress);

    
    const phasesProgress = await this.enterpriseRepository.findPhasesByEnterprise(enterpriseId);
    const totalPhases = phasesProgress.length;
    const totalPhaseProgress = phasesProgress.reduce((sum, p) => sum + p.progress, 0);
    const enterpriseProgress = totalPhases > 0 ? totalPhaseProgress / totalPhases : 0;
    await this.enterpriseRepository.updateEnterpriseProgress(enterpriseId, enterpriseProgress);

    
    if (phaseProgress === 100) {
      const nextPhase = await this.findNextPhase(enterpriseId, phase.order);

      if (nextPhase) {
        
        await this.enterpriseRepository.update(enterpriseId, {
          currentPhase: { connect: { id: nextPhase.id } }, 
        });
      } else {
        
        await this.enterpriseRepository.update(enterpriseId, {
          status: EnterpriseStatus.COMPLETED,
        });
      }
    }

    console.log(
      `Progresso atualizado: Fase ${phase.id} -> ${phaseProgress.toFixed(2)}%, Empreendimento ${enterpriseId} -> ${enterpriseProgress.toFixed(2)}%`
    );
  }

  private async findNextPhase(enterpriseId: number, currentOrder: number) {
    
    const nextPhase = await this.enterpriseRepository.findAllPhasesByEnterprise(enterpriseId);

    
    const nextPhases = nextPhase.filter((p) => p.order > currentOrder);
    nextPhases.sort((a, b) => a.order - b.order);

    return nextPhases[0] || null;
  }
}
