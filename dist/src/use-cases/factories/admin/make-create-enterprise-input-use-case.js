"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateEnterpriseUseCase = makeCreateEnterpriseUseCase;
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const create_enterprise_input_use_case_1 = require("@/use-cases/admin/create-enterprise-input-use-case");
function makeCreateEnterpriseUseCase() {
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository();
    const createEnterpriseUseCase = new create_enterprise_input_use_case_1.CreateEnterpriseUseCase(enterpriseRepository);
    return createEnterpriseUseCase;
}
