var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeInterestEnterpriseUseCase } from '@/use-cases/factories/users/make-interest-enterprise-use-case';
import { z } from 'zod';
export function interestEnterpriseHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const interestSchema = z.object({
            enterpriseId: z.number(),
        });
        try {
            const { enterpriseId } = interestSchema.parse(request.body);
            const interestEnterpriseUseCase = makeInterestEnterpriseUseCase();
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
