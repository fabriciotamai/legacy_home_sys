"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSendDocumentsUseCase = makeSendDocumentsUseCase;
const prisma_users_repository_1 = require("@/repositories/prisma/prisma-users-repository");
const send_document_use_case_1 = require("@/use-cases/users/send-document-use-case");
function makeSendDocumentsUseCase() {
    const usersRepository = new prisma_users_repository_1.PrismaUsersRepository();
    return new send_document_use_case_1.SendDocumentsUseCase(usersRepository);
}
