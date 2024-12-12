"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkEnterpriseToUserHandler = linkEnterpriseToUserHandler;
const make_link_enterprise_to_user_use_case_1 = require("@/use-cases/factories/admin/make-link-enterprise-to-user-use-case");
const zod_1 = require("zod");
const linkEnterpriseToUserSchema = zod_1.z.object({
    userId: zod_1.z.number().int().positive(),
    enterpriseId: zod_1.z.number().int().positive(),
});
function linkEnterpriseToUserHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const input = linkEnterpriseToUserSchema.parse(request.body);
            const linkUserToEnterpriseUseCase = (0, make_link_enterprise_to_user_use_case_1.makeLinkUserToEnterpriseUseCase)();
            const contractInterest = yield linkUserToEnterpriseUseCase.execute(input);
            reply.status(201).send({
                message: 'Usuário vinculado ao empreendimento com sucesso.',
                contractInterest,
            });
        }
        catch (error) {
            console.error('Erro ao vincular usuário ao empreendimento:', error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : 'Erro inesperado.',
            });
        }
    });
}
