"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPhasesUseCase = void 0;
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const get_phases_use_case_1 = require("@/use-cases/admin/get-phases-use-case");
const makeGetPhasesUseCase = () => {
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository();
    return new get_phases_use_case_1.GetPhasesUseCase(enterpriseRepository);
};
exports.makeGetPhasesUseCase = makeGetPhasesUseCase;
