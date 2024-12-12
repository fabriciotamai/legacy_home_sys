"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetEnterprisesWithInterestsUseCase = makeGetEnterprisesWithInterestsUseCase;
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const get_enterprise_user_interest_use_case_1 = require("@/use-cases/admin/get-enterprise-user-interest-use-case");
function makeGetEnterprisesWithInterestsUseCase() {
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository();
    return new get_enterprise_user_interest_use_case_1.GetEnterprisesWithInterestsUseCase(enterpriseRepository);
}
