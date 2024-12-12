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
exports.PrismaEnterpriseRepository = void 0;
const prisma_1 = require("@/lib/prisma");
class PrismaEnterpriseRepository {
    findById(enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.enterprise.findUnique({
                where: { id: enterpriseId },
                include: {
                    currentPhase: true,
                    currentTask: true,
                },
            });
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.enterprise.findFirst({
                where: { name },
            });
        });
    }
    findWithInterests() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.enterprise.findMany({
                where: {
                    contractInterests: {
                        some: {},
                    },
                },
                include: {
                    contractInterests: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });
    }
    findInterestById(interestId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.contractInterest.findUnique({
                where: { interestId },
            });
        });
    }
    removeOtherInterests(enterpriseId, approvedInterestId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.contractInterest.deleteMany({
                where: {
                    enterpriseId,
                    interestId: {
                        not: approvedInterestId,
                    },
                },
            });
        });
    }
    updateInterestStatus(interestId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.contractInterest.update({
                where: { interestId },
                data: { status },
            });
        });
    }
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, investmentType, isAvailable } = filters;
            return yield prisma_1.prisma.enterprise.findMany({
                where: {
                    status: status || undefined,
                    investmentType: investmentType || undefined,
                    isAvailable: isAvailable !== undefined ? isAvailable : undefined,
                },
                include: {
                    currentPhase: true,
                    currentTask: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });
    }
    linkUserToEnterprise(userId, enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.contractInterest.create({
                data: {
                    userId,
                    enterpriseId,
                    status: 'PENDING',
                },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.enterprise.create({ data });
        });
    }
    update(enterpriseId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.enterprise.update({
                where: { id: enterpriseId },
                data,
            });
        });
    }
    findPhaseById(phaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.phase.findUnique({
                where: { id: phaseId },
                include: { tasks: true },
            });
        });
    }
    findAllPhasesWithTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.phase.findMany({
                include: { tasks: true },
            });
        });
    }
    findTaskById(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.task.findUnique({
                where: { id: taskId },
            });
        });
    }
    associateTasksToEnterprise(enterpriseId, taskIds) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const taskId of taskIds) {
                yield prisma_1.prisma.enterpriseTaskStatus.create({
                    data: {
                        enterpriseId,
                        taskId,
                        isCompleted: false,
                    },
                });
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enterprises = yield prisma_1.prisma.enterprise.findMany({
                where: {
                    OR: [
                        {
                            contracts: {
                                some: {
                                    userId,
                                },
                            },
                        },
                        {
                            contractInterests: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    ],
                },
                include: {
                    currentPhase: true,
                    currentTask: true,
                    contractInterests: {
                        where: {
                            userId,
                        },
                        select: {
                            status: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return enterprises.map((enterprise) => {
                var _a;
                return (Object.assign(Object.assign({}, enterprise), { interestStatus: ((_a = enterprise.contractInterests[0]) === null || _a === void 0 ? void 0 : _a.status) || null }));
            });
        });
    }
}
exports.PrismaEnterpriseRepository = PrismaEnterpriseRepository;
