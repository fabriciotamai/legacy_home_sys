var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeGetEnterprisesAvailableUseCase } from '@/use-cases/factories/users/make-get-enterprise-available-use-case';
import { z } from 'zod';
export function getEnterprisesAvailableHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterSchema = z.object({
            status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
            investmentType: z.enum(['MONEY', 'PROPERTY']).optional(),
            isAvailable: z.boolean().optional(),
        });
        try {
            const filters = filterSchema.parse(request.query);
            const getEnterprisesUseCase = makeGetEnterprisesAvailableUseCase();
            const enterprises = yield getEnterprisesUseCase.execute(filters);
            reply.status(200).send(enterprises);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                reply.status(400).send({ message: 'Parâmetros inválidos.', errors: error.errors });
            }
            else {
                console.error('Erro inesperado:', error);
                reply.status(500).send({ message: 'Erro interno no servidor.' });
            }
        }
    });
}
