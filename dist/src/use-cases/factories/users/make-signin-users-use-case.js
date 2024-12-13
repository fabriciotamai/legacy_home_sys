"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserSignin = makeUserSignin;
const prisma_users_repository_1 = require("@/repositories/prisma/prisma-users-repository");
const signin_users_1 = require("../../users/signin-users");
function makeUserSignin() {
    const userRepository = new prisma_users_repository_1.PrismaUsersRepository();
    return new signin_users_1.SigninUsers(userRepository);
}
