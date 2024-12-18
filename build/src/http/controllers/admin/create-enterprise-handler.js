var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeCreateEnterpriseUseCase } from '@/use-cases/factories/admin/make-create-enterprise-input-use-case';
import { z } from 'zod';
const createEnterpriseSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório.'),
    description: z.string().min(1, 'A descrição é obrigatória.'),
    investmentType: z.enum(['MONEY', 'PROPERTY'], {
        errorMap: () => ({
            message: 'O tipo de investimento deve ser MONEY ou PROPERTY.',
        }),
    }),
    isAvailable: z.boolean(),
    constructionType: z.string().min(1, 'O tipo de construção é obrigatório.'),
    fundingAmount: z.number().positive('O valor de aporte deve ser maior que zero.'),
    transferAmount: z.number().positive('O valor repassado deve ser maior que zero.'),
    postalCode: z.string().min(1, 'O código postal é obrigatório.'),
    city: z.string().min(1, 'A cidade é obrigatória.'),
    squareMeterValue: z.number().positive('O valor por metro quadrado deve ser maior que zero.'),
    area: z.number().positive('A metragem total deve ser maior que zero.'),
    floors: z.number().int().positive().optional(),
    completionDate: z.coerce
        .date()
        .optional()
        .refine((date) => !date || date > new Date(), 'A data de conclusão deve ser no futuro.'),
});
export function createEnterpriseHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedBody = createEnterpriseSchema.parse(request.body);
            console.info('Criando empreendimento com os dados fornecidos.');
            const createEnterpriseUseCase = makeCreateEnterpriseUseCase();
            const enterprise = yield createEnterpriseUseCase.execute(validatedBody);
            reply.status(201).send({
                message: 'Empreendimento criado com sucesso.',
                enterprise,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                console.warn('Erro de validação:', error.errors);
                reply.status(422).send({
                    errors: error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            console.error('Erro ao criar empreendimento:', error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : 'Erro inesperado.',
            });
        }
    });
}
