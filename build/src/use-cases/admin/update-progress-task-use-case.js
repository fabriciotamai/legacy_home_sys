var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class UpdateProgressUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { enterpriseId, phaseId, taskId, isCompleted } = input;
            const task = yield this.enterpriseRepository.findTaskWithPhaseAndEnterprise(enterpriseId, taskId);
            if (!task || task.phase.id !== phaseId) {
                throw new Error(`Tarefa não encontrada ou não pertence à fase (${phaseId}) ou ao empreendimento (${enterpriseId}).`);
            }
            if (isCompleted) {
                yield this.enterpriseRepository.updateTaskStatus(enterpriseId, taskId, isCompleted);
                const phaseProgress = yield this.recalculatePhaseProgress(enterpriseId, phaseId);
                const enterpriseProgress = yield this.recalculateEnterpriseProgress(enterpriseId);
                yield this.moveToNextTaskOrPhase(enterpriseId, phaseId, taskId);
                console.log(`Progresso atualizado: Fase ${phaseId} -> ${phaseProgress.toFixed(2)}%, Empreendimento ${enterpriseId} -> ${enterpriseProgress.toFixed(2)}%.`);
            }
            else {
                yield this.moveToPreviousTaskAndReset(enterpriseId, phaseId, taskId);
            }
        });
    }
    recalculatePhaseProgress(enterpriseId, phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.enterpriseRepository.findTasksInPhaseByEnterprise(enterpriseId, phaseId);
            if (!tasks.length) {
                throw new Error(`Nenhuma tarefa encontrada para a fase (${phaseId}) e empreendimento (${enterpriseId}).`);
            }
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter((task) => task.isCompleted).length;
            const phaseProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            yield this.enterpriseRepository.updatePhaseProgress(enterpriseId, phaseId, phaseProgress);
            return phaseProgress;
        });
    }
    recalculateEnterpriseProgress(enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const phases = yield this.enterpriseRepository.findPhasesByEnterprise(enterpriseId);
            if (!phases.length) {
                throw new Error('Nenhuma fase encontrada para o empreendimento.');
            }
            const totalPhases = phases.length;
            const totalPhaseProgress = phases.reduce((sum, phase) => sum + phase.progress, 0);
            const enterpriseProgress = totalPhases > 0 ? totalPhaseProgress / totalPhases : 0;
            yield this.enterpriseRepository.updateEnterpriseProgress(enterpriseId, enterpriseProgress);
            return enterpriseProgress;
        });
    }
    moveToNextTaskOrPhase(enterpriseId, phaseId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const tasks = yield this.enterpriseRepository.findTasksInPhaseByEnterprise(enterpriseId, phaseId);
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
                yield this.enterpriseRepository.updateEnterprisePhaseAndTask(enterpriseId, phaseId, nextTask.task.id);
            }
            else {
                const allPhases = yield this.enterpriseRepository.findAllPhasesByEnterprise(enterpriseId);
                const currentPhaseIndex = allPhases.findIndex((p) => p.id === phaseId);
                const nextPhase = allPhases[currentPhaseIndex + 1];
                if (nextPhase) {
                    const nextPhaseFirstTask = nextPhase.tasks.sort((a, b) => a.id - b.id)[0];
                    const nextTaskId = (_a = nextPhaseFirstTask === null || nextPhaseFirstTask === void 0 ? void 0 : nextPhaseFirstTask.id) !== null && _a !== void 0 ? _a : undefined;
                    yield this.enterpriseRepository.updateEnterprisePhaseAndTask(enterpriseId, nextPhase.id, nextTaskId);
                }
                else {
                    console.log(`Empreendimento ${enterpriseId} completo!`);
                }
            }
        });
    }
    moveToPreviousTaskAndReset(enterpriseId, phaseId, targetTaskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.enterpriseRepository.findTasksInPhaseByEnterprise(enterpriseId, phaseId);
            if (!tasks.length) {
                throw new Error(`Nenhuma tarefa encontrada para a fase (${phaseId}).`);
            }
            const targetTask = tasks.find((task) => task.task.id === targetTaskId);
            if (!targetTask) {
                throw new Error(`A tarefa (${targetTaskId}) não pertence à fase (${phaseId}) no empreendimento (${enterpriseId}).`);
            }
            yield Promise.all(tasks.map((task) => this.enterpriseRepository.updateTaskStatus(enterpriseId, task.task.id, false)));
            yield this.enterpriseRepository.updateEnterprisePhaseAndTask(enterpriseId, phaseId, targetTaskId);
            yield this.recalculatePhaseProgress(enterpriseId, phaseId);
            yield this.recalculateEnterpriseProgress(enterpriseId);
        });
    }
}
