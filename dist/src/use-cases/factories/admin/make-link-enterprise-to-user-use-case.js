"use strict";
// src/use-cases/factories/admin/make-link-user-to-enterprise-use-case.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLinkUserToEnterpriseUseCase = makeLinkUserToEnterpriseUseCase;
const prisma_admin_repository_1 = require("@/repositories/prisma/prisma-admin-repository");
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const link_enterprise_to_user_use_case_1 = require("@/use-cases/admin/link-enterprise-to-user-use-case");
function makeLinkUserToEnterpriseUseCase() {
    const adminRepository = new prisma_admin_repository_1.PrismaAdminRepository();
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository();
    return new link_enterprise_to_user_use_case_1.LinkUserToEnterpriseUseCase(adminRepository, enterpriseRepository);
}
