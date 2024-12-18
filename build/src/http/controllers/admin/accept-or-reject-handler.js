var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeAcceptOrRejectInterestUseCase } from '@/use-cases/factories/admin/make-accept-or-reject-use-case';
import { z } from 'zod';
const acceptOrRejectZodSchema = z.object({
    interestId: z.string().length(8),
    status: z.enum(['APPROVED', 'REJECTED']),
});
export function acceptOrRejectInterestHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { interestId, status } = acceptOrRejectZodSchema.parse(request.body);
            const acceptOrRejectInterestUseCase = makeAcceptOrRejectInterestUseCase();
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
