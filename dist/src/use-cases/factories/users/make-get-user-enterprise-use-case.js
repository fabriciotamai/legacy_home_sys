"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserEnterprisesUseCase = makeGetUserEnterprisesUseCase;
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const get_user_enterprise_use_case_1 = require("@/use-cases/users/get-user-enterprise-use-case");
function makeGetUserEnterprisesUseCase() {
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository();
    const getUserEnterprisesUseCase = new get_user_enterprise_use_case_1.GetUserEnterprisesUseCase(enterpriseRepository);
    return getUserEnterprisesUseCase;
}
