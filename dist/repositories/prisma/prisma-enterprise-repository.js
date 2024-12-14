var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { prisma } from '@/lib/prisma';
export class PrismaEnterpriseRepository {
    findById(enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterprise.findUnique({
                where: { id: enterpriseId },
                include: {
                    currentPhase: true,
                    currentTask: true,
                },
            });
        });
    }
    findPhasesByEnterprise(enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterprisePhaseStatus.findMany({
                where: { enterpriseId },
                select: {
                    phaseId: true,
                    progress: true,
                },
            });
        });
    }
    findPhaseWithTasks(phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.phase.findUnique({
                where: { id: phaseId },
                include: {
                    tasks: true,
                },
            });
        });
    }
    findTasksInPhaseByEnterprise(enterpriseId, phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterpriseTaskStatus.findMany({
                where: {
                    enterpriseId,
                    task: { phaseId },
                },
                include: {
                    task: true,
                },
            });
        });
    }
    findTaskWithPhaseAndEnterprise(enterpriseId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskStatus = yield prisma.enterpriseTaskStatus.findFirst({
                where: {
                    enterpriseId,
                    taskId,
                },
                include: {
                    task: {
                        include: {
                            phase: true,
                        },
                    },
                },
            });
            return taskStatus ? taskStatus.task : null;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterprise.findFirst({
                where: { name },
            });
        });
    }
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (filters.status !== undefined)
                where.status = filters.status;
            if (filters.investmentType !== undefined)
                where.investmentType = filters.investmentType;
            if (filters.isAvailable !== undefined)
                where.isAvailable = filters.isAvailable;
            return prisma.enterprise.findMany({
                where,
                include: {
                    currentPhase: true,
                    currentTask: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterprise.create({ data });
        });
    }
    update(enterpriseId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterprise.update({
                where: { id: enterpriseId },
                data,
            });
        });
    }
    updateEnterpriseProgress(enterpriseId, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.enterprise.update({
                where: { id: enterpriseId },
                data: { progress },
            });
        });
    }
    initializeEnterprisePhasesAndTasks(enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const phases = yield prisma.phase.findMany({
                include: { tasks: true },
            });
            for (const phase of phases) {
                yield prisma.enterprisePhaseStatus.create({
                    data: {
                        enterpriseId,
                        phaseId: phase.id,
                        progress: 0,
                    },
                });
                const taskPromises = phase.tasks.map((task) => prisma.enterpriseTaskStatus.create({
                    data: {
                        enterpriseId,
                        taskId: task.id,
                        isCompleted: false,
                    },
                }));
                yield Promise.all(taskPromises);
            }
        });
    }
    linkUserToEnterprise(userId, enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.contractInterest.create({
                data: {
                    userId,
                    enterpriseId,
                    status: 'PENDING',
                },
            });
        });
    }
    findInterestById(interestId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.contractInterest.findUnique({
                where: { interestId },
            });
        });
    }
    updateInterestStatus(interestId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.contractInterest.update({
                where: { interestId },
                data: { status },
            });
        });
    }
    removeOtherInterests(enterpriseId, approvedInterestId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.contractInterest.deleteMany({
                where: {
                    enterpriseId,
                    interestId: { not: approvedInterestId },
                },
            });
        });
    }
    findWithInterests() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterprise.findMany({
                where: {
                    contractInterests: { some: {} },
                },
                include: {
                    contractInterests: {
                        include: { user: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enterprises = yield prisma.enterprise.findMany({
                where: {
                    OR: [
                        { contracts: { some: { userId } } },
                        { contractInterests: { some: { userId } } },
                    ],
                },
                include: {
                    currentPhase: true,
                    currentTask: true,
                    contractInterests: {
                        where: { userId },
                        select: { status: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return enterprises.map((enterprise) => {
                var _a, _b;
                const interestStatus = (_b = (_a = enterprise.contractInterests[0]) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : undefined;
                const { contractInterests } = enterprise, rest = __rest(enterprise, ["contractInterests"]);
                return Object.assign(Object.assign({}, rest), { interestStatus });
            });
        });
    }
    updateEnterprisePhaseAndTask(enterpriseId, phaseId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.enterprise.update({
                where: { id: enterpriseId },
                data: {
                    currentPhaseId: phaseId,
                    currentTaskId: taskId || null,
                },
                include: {
                    currentPhase: true,
                    currentTask: true,
                },
            });
        });
    }
    findPhaseById(phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.phase.findUnique({
                where: { id: phaseId },
                include: { tasks: true },
            });
        });
    }
    findAllPhasesWithTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.phase.findMany({
                include: { tasks: true },
            });
        });
    }
    findAllPhasesByEnterprise(enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.phase.findMany({
                where: {
                    enterprises: { some: { id: enterpriseId } },
                },
                include: { tasks: true },
            });
        });
    }
    updatePhaseProgress(enterpriseId, phaseId, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.enterprisePhaseStatus.update({
                where: {
                    enterpriseId_phaseId: {
                        enterpriseId,
                        phaseId,
                    },
                },
                data: { progress },
            });
        });
    }
    createPhase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.phase.create({ data });
        });
    }
    findTaskById(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.task.findUnique({
                where: { id: taskId },
            });
        });
    }
    findTaskWithPhase(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.task.findUnique({
                where: { id: taskId },
                include: { phase: true },
            });
        });
    }
    createTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.task.create({ data });
        });
    }
    associateTasksToEnterprise(enterpriseId, taskIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = taskIds.map((taskId) => prisma.enterpriseTaskStatus.create({
                data: {
                    enterpriseId,
                    taskId,
                    isCompleted: false,
                },
            }));
            yield Promise.all(updates);
        });
    }
    updateTaskStatus(enterpriseId, taskId, isCompleted) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.enterpriseTaskStatus.updateMany({
                where: {
                    enterpriseId,
                    taskId,
                },
                data: { isCompleted },
            });
        });
    }
    createPhaseProgress(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.enterprisePhaseStatus.create({
                data: {
                    enterpriseId: data.enterpriseId,
                    phaseId: data.phaseId,
                    progress: data.progress,
                },
            });
        });
    }
    createTaskProgress(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.enterpriseTaskStatus.create({
                data: {
                    enterpriseId: data.enterpriseId,
                    taskId: data.taskId,
                    isCompleted: data.isCompleted, // Agora explicitamente parte do tipo
                },
            });
        });
    }
}
