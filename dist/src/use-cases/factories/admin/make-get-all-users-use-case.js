"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAllUsersUseCase = makeGetAllUsersUseCase;
const prisma_admin_repository_1 = require("@/repositories/prisma/prisma-admin-repository");
const get_all_users_use_case_1 = require("@/use-cases/admin/get-all-users-use-case");
function makeGetAllUsersUseCase() {
    const adminRepository = new prisma_admin_repository_1.PrismaAdminRepository();
    return new get_all_users_use_case_1.GetAllUsersUseCase(adminRepository);
}
