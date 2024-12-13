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
exports.interestEnterpriseHandler = interestEnterpriseHandler;
const make_interest_enterprise_use_case_1 = require("@/use-cases/factories/users/make-interest-enterprise-use-case");
const zod_1 = require("zod");
function interestEnterpriseHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const interestSchema = zod_1.z.object({
            enterpriseId: zod_1.z.number(),
        });
        try {
            const { enterpriseId } = interestSchema.parse(request.body);
            const interestEnterpriseUseCase = (0, make_interest_enterprise_use_case_1.makeInterestEnterpriseUseCase)();
            const effectiveUserId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!effectiveUserId) {
                return reply.status(400).send({ message: 'Usuário não autenticado.' });
            }
            const result = yield interestEnterpriseUseCase.execute({
                userId: effectiveUserId,
                enterpriseId,
            });
            reply.status(200).send(result);
        }
        catch (error) {
            if (error.status && error.message) {
                reply.status(error.status).send({ message: error.message });
            }
            else {
                console.error('Erro inesperado:', error);
                reply.status(500).send({ message: 'Erro interno no servidor.' });
            }
        }
    });
}
