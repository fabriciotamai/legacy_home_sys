"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeManageComplianceUseCase = makeManageComplianceUseCase;
const prisma_admin_repository_1 = require("@/repositories/prisma/prisma-admin-repository");
const manage_compliance_use_case_1 = require("@/use-cases/admin/manage-compliance-use-case");
function makeManageComplianceUseCase() {
    const adminRepository = new prisma_admin_repository_1.PrismaAdminRepository();
    return new manage_compliance_use_case_1.ManageComplianceUseCase(adminRepository);
}
