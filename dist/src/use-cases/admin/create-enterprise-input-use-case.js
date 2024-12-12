"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEnterpriseUseCase = void 0;
class CreateEnterpriseUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, investmentType, isAvailable, currentPhaseId, currentTaskId, constructionType, fundingAmount, transferAmount, postalCode, city, squareMeterValue, area, floors, completionDate, } = input;
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
            const existingEnterprise = yield this.enterpriseRepository.findByName(name);
            if (existingEnterprise) {
                throw new Error('Já existe um empreendimento com esse nome.');
            }
            if (currentPhaseId) {
                const phase = yield this.enterpriseRepository.findPhaseById(currentPhaseId);
                if (!phase) {
                    throw new Error(`A fase com ID ${currentPhaseId} especificada não existe.`);
                }
                if (currentTaskId) {
                    const task = yield this.enterpriseRepository.findTaskById(currentTaskId);
                    if (!task) {
                        throw new Error(`A tarefa com ID ${currentTaskId} especificada não existe.`);
                    }
                    if (task.phaseId !== currentPhaseId) {
                        throw new Error(`A tarefa com ID ${currentTaskId} não pertence à fase especificada.`);
                    }
                }
            }
            const enterprise = yield this.enterpriseRepository.create({
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
        });
    }
}
exports.CreateEnterpriseUseCase = CreateEnterpriseUseCase;
