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
exports.acceptOrRejectInterestHandler = acceptOrRejectInterestHandler;
const make_accept_or_reject_use_case_1 = require("@/use-cases/factories/admin/make-accept-or-reject-use-case");
const zod_1 = require("zod");
const acceptOrRejectZodSchema = zod_1.z.object({
    interestId: zod_1.z.string().length(8),
    status: zod_1.z.enum(['APPROVED', 'REJECTED']),
});
function acceptOrRejectInterestHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { interestId, status } = acceptOrRejectZodSchema.parse(request.body);
            const acceptOrRejectInterestUseCase = (0, make_accept_or_reject_use_case_1.makeAcceptOrRejectInterestUseCase)();
            const updatedInterest = yield acceptOrRejectInterestUseCase.execute({
                interestId,
                status,
            });
            reply.status(200).send({
                message: 'Interesse atualizado com sucesso.',
                updatedInterest,
            });
        }
        catch (error) {
            console.error('Erro ao processar interesse:', error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : 'Erro inesperado.',
            });
        }
    });
}
