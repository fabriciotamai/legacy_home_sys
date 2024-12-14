var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeManageComplianceUseCase } from '@/use-cases/factories/admin/make-manage-compliance-use-case';
import { z } from 'zod';
export function manageComplianceHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const manageComplianceSchema = z.object({
            action: z.enum(['approve', 'reject']),
            reason: z.string().optional(),
        });
        try {
            const { userId } = request.params;
            const body = manageComplianceSchema.parse(request.body);
            const manageComplianceUseCase = makeManageComplianceUseCase();
            yield manageComplianceUseCase.execute({
                userId: parseInt(userId, 10),
                action: body.action,
                reason: body.reason,
            });
            reply.status(200).send({
                message: body.action === 'approve'
                    ? 'Compliance aprovado com sucesso.'
                    : 'Compliance rejeitado com sucesso.',
            });
        }
        catch (error) {
            console.error('Erro ao gerenciar compliance:', error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : 'Erro inesperado.',
            });
        }
    });
}
