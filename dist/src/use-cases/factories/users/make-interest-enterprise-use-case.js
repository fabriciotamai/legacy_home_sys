"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeInterestEnterpriseUseCase = makeInterestEnterpriseUseCase;
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const prisma_users_repository_1 = require("@/repositories/prisma/prisma-users-repository");
const interest_enterprise_use_case_1 = require("@/use-cases/users/interest-enterprise-use-case");
function makeInterestEnterpriseUseCase() {
    const usersRepository = new prisma_users_repository_1.PrismaUsersRepository();
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository();
    const interestEnterpriseUseCase = new interest_enterprise_use_case_1.InterestEnterpriseUseCase(usersRepository, enterpriseRepository);
    return interestEnterpriseUseCase;
}
