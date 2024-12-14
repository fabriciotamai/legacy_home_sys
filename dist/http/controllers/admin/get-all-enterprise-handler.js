var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeGetAllEnterprisesUseCase } from '@/use-cases/factories/admin/make-get-all-enterprise-use-case';
import { z } from 'zod';
const getAllEnterprisesQuerySchema = z.object({
    status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
    investmentType: z.enum(['MONEY', 'PROPERTY']).optional(),
    isAvailable: z.boolean().optional(),
});
export function getAllEnterprisesHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = getAllEnterprisesQuerySchema.parse(request.query);
            const status = filters.status;
            const getAllEnterprisesUseCase = makeGetAllEnterprisesUseCase();
            const enterprises = yield getAllEnterprisesUseCase.execute({
                status,
                investmentType: filters.investmentType,
                isAvailable: filters.isAvailable,
            });
            reply.status(200).send({
                message: 'Empreendimentos recuperados com sucesso.',
                enterprises,
            });
        }
        catch (error) {
            console.error('Erro ao buscar empreendimentos:', error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : 'Erro inesperado.',
            });
        }
    });
}
