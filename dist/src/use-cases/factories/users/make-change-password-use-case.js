"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeChangePassword = makeChangePassword;
const prisma_users_repository_1 = require("@/repositories/prisma/prisma-users-repository");
const change_password_use_case_1 = require("../../users/change-password-use-case");
function makeChangePassword() {
    const userRepository = new prisma_users_repository_1.PrismaUsersRepository();
    return new change_password_use_case_1.ChangePasswordUseCase(userRepository);
}
