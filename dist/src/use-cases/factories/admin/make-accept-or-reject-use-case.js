"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAcceptOrRejectInterestUseCase = makeAcceptOrRejectInterestUseCase;
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const accept_interest_use_case_1 = require("@/use-cases/admin/accept-interest-use-case");
function makeAcceptOrRejectInterestUseCase() {
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository();
    const useCase = new accept_interest_use_case_1.AcceptOrRejectInterestUseCase(enterpriseRepository);
    return useCase;
}
