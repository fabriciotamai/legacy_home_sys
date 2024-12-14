var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class CreateEnterpriseUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, investmentType, isAvailable, constructionType, fundingAmount, transferAmount, postalCode, city, squareMeterValue, area, floors, completionDate, } = input;
            this.validateInput(input);
            const existingEnterprise = yield this.enterpriseRepository.findByName(name);
            if (existingEnterprise) {
                throw new Error("Já existe um empreendimento com esse nome.");
            }
            const enterprise = yield this.enterpriseRepository.create({
                name,
                description,
                investmentType,
                isAvailable,
                status: "NEW",
                constructionType,
                fundingAmount,
                transferAmount,
                postalCode,
                city,
                squareMeterValue,
                area,
                floors: floors !== null && floors !== void 0 ? floors : null,
                completionDate: completionDate !== null && completionDate !== void 0 ? completionDate : null,
            });
            if (!enterprise) {
                throw new Error("Erro ao criar o empreendimento.");
            }
            const phaseTemplates = yield this.enterpriseRepository.findAllPhasesWithTasks();
            if (!phaseTemplates || phaseTemplates.length === 0) {
                throw new Error("Nenhuma fase padrão encontrada.");
            }
            yield this.initializePhasesAndTasks(enterprise.id, phaseTemplates);
            const initialPhase = phaseTemplates.find((template) => template.order === 1);
            if (!initialPhase) {
                throw new Error("Fase inicial (ordem 1) não encontrada.");
            }
            const firstTask = initialPhase.tasks[0];
            if (!firstTask) {
                throw new Error("Nenhuma tarefa encontrada na fase inicial.");
            }
            const updatedEnterprise = yield this.enterpriseRepository.updateEnterprisePhaseAndTask(enterprise.id, initialPhase.id, firstTask.id);
            return {
                message: "Empreendimento criado com sucesso.",
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
        });
    }
    validateInput(input) {
        const { name, description, investmentType, fundingAmount, area } = input;
        if (!name || !description) {
            throw new Error("Nome e descrição são obrigatórios.");
        }
        if (!["MONEY", "PROPERTY"].includes(investmentType)) {
            throw new Error("Tipo de investimento inválido.");
        }
        if (fundingAmount <= 0 || area <= 0) {
            throw new Error("O valor de aporte e a metragem devem ser maiores que zero.");
        }
    }
    initializePhasesAndTasks(enterpriseId, phases) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const phase of phases) {
                yield this.enterpriseRepository.createPhaseProgress({
                    enterpriseId,
                    phaseId: phase.id,
                    progress: 0,
                });
                for (const task of phase.tasks) {
                    yield this.enterpriseRepository.createTaskProgress({
                        enterpriseId,
                        taskId: task.id,
                        isCompleted: false,
                    });
                }
            }
        });
    }
}
