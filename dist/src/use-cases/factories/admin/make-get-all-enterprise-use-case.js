"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAllEnterprisesUseCase = makeGetAllEnterprisesUseCase;
const prisma_enterprise_repository_1 = require("@/repositories/prisma/prisma-enterprise-repository");
const get_all_enterprise_use_case_1 = require("@/use-cases/admin/get-all-enterprise-use-case"); // Corrigido o caminho do use case
function makeGetAllEnterprisesUseCase() {
    const enterpriseRepository = new prisma_enterprise_repository_1.PrismaEnterpriseRepository(); // Certifique-se que está importando o repositório correto
    return new get_all_enterprise_use_case_1.GetAllEnterprisesUseCase(enterpriseRepository); // Passa o repositório para o use case
}
