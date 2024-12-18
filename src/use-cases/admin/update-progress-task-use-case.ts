import { EnterpriseRepository } from '@/repositories/enterprise-repository';

interface UpdateTaskStatusInput {
  enterpriseId: number;
  phaseId: number;
  taskId: number;
  isCompleted: boolean;
}

export class UpdateProgressUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: UpdateTaskStatusInput): Promise<void> {
    const { enterpriseId, phaseId, taskId, isCompleted } = input;

    const task = await this.enterpriseRepository.findTaskWithPhaseAndEnterprise(enterpriseId, taskId);

    if (!task || task.phase.id !== phaseId) {
      throw new Error(
        `Tarefa não encontrada ou não pertence à fase (${phaseId}) ou ao empreendimento (${enterpriseId}).`,
      );
    }

    if (isCompleted) {
      await this.enterpriseRepository.updateTaskStatus(enterpriseId, taskId, isCompleted);
      const phaseProgress = await this.recalculatePhaseProgress(enterpriseId, phaseId);
      const enterpriseProgress = await this.recalculateEnterpriseProgress(enterpriseId);
      await this.moveToNextTaskOrPhase(enterpriseId, phaseId, taskId);

      console.log(
        `Progresso atualizado: Fase ${phaseId} -> ${phaseProgress.toFixed(
          2,
        )}%, Empreendimento ${enterpriseId} -> ${enterpriseProgress.toFixed(2)}%.`,
      );
    } else {
      await this.moveToPreviousTaskAndReset(enterpriseId, phaseId, taskId);
    }
  }

  private async recalculatePhaseProgress(enterpriseId: number, phaseId: number): Promise<number> {
    const tasks = await this.enterpriseRepository.findTasksInPhaseByEnterprise(enterpriseId, phaseId);

    if (!tasks.length) {
      throw new Error(`Nenhuma tarefa encontrada para a fase (${phaseId}) e empreendimento (${enterpriseId}).`);
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.isCompleted).length;

    const phaseProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    await this.enterpriseRepository.updatePhaseProgress(enterpriseId, phaseId, phaseProgress);

    return phaseProgress;
  }

  private async recalculateEnterpriseProgress(enterpriseId: number): Promise<number> {
    const phases = await this.enterpriseRepository.findPhasesByEnterprise(enterpriseId);

    if (!phases.length) {
      throw new Error('Nenhuma fase encontrada para o empreendimento.');
    }

    const totalPhases = phases.length;
    const totalPhaseProgress = phases.reduce((sum, phase) => sum + phase.progress, 0);
    const enterpriseProgress = totalPhases > 0 ? totalPhaseProgress / totalPhases : 0;

    await this.enterpriseRepository.updateEnterpriseProgress(enterpriseId, enterpriseProgress);

    return enterpriseProgress;
  }

  private async moveToNextTaskOrPhase(enterpriseId: number, phaseId: number, taskId: number): Promise<void> {
    const tasks = await this.enterpriseRepository.findTasksInPhaseByEnterprise(enterpriseId, phaseId);

    if (!tasks.length) {
      throw new Error('Nenhuma tarefa encontrada para a fase.');
    }

    const sortedTasks = tasks.sort((a, b) => a.task.id - b.task.id);
    const currentTaskIndex = sortedTasks.findIndex((task) => task.task.id === taskId);

    if (currentTaskIndex === -1) {
      throw new Error('Tarefa atual não encontrada na fase.');
    }

    const nextTask = sortedTasks[currentTaskIndex + 1];

    if (nextTask) {
      await this.enterpriseRepository.updateEnterprisePhaseAndTask(enterpriseId, phaseId, nextTask.task.id);
    } else {
      const allPhases = await this.enterpriseRepository.findAllPhasesByEnterprise(enterpriseId);
      const currentPhaseIndex = allPhases.findIndex((p) => p.id === phaseId);

      const nextPhase = allPhases[currentPhaseIndex + 1];
      if (nextPhase) {
        const nextPhaseFirstTask = nextPhase.tasks.sort((a, b) => a.id - b.id)[0];

        const nextTaskId = nextPhaseFirstTask?.id ?? undefined;

        await this.enterpriseRepository.updateEnterprisePhaseAndTask(enterpriseId, nextPhase.id, nextTaskId);
      } else {
        console.log(`Empreendimento ${enterpriseId} completo!`);
      }
    }
  }

  private async moveToPreviousTaskAndReset(enterpriseId: number, phaseId: number, targetTaskId: number): Promise<void> {
    const tasks = await this.enterpriseRepository.findTasksInPhaseByEnterprise(enterpriseId, phaseId);

    if (!tasks.length) {
      throw new Error(`Nenhuma tarefa encontrada para a fase (${phaseId}).`);
    }

    const targetTask = tasks.find((task) => task.task.id === targetTaskId);
    if (!targetTask) {
      throw new Error(
        `A tarefa (${targetTaskId}) não pertence à fase (${phaseId}) no empreendimento (${enterpriseId}).`,
      );
    }

    await Promise.all(
      tasks.map((task) => this.enterpriseRepository.updateTaskStatus(enterpriseId, task.task.id, false)),
    );

    await this.enterpriseRepository.updateEnterprisePhaseAndTask(enterpriseId, phaseId, targetTaskId);

    await this.recalculatePhaseProgress(enterpriseId, phaseId);

    await this.recalculateEnterpriseProgress(enterpriseId);
  }
}
