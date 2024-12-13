"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAdminRegisterUsers = makeAdminRegisterUsers;
const prisma_admin_repository_1 = require("@/repositories/prisma/prisma-admin-repository");
const admin_register_users_use_case_1 = require("../../admin/admin-register-users-use-case");
function makeAdminRegisterUsers() {
    const adminRepository = new prisma_admin_repository_1.PrismaAdminRepository();
    return new admin_register_users_use_case_1.AdminRegisterUsersUseCase(adminRepository);
}
