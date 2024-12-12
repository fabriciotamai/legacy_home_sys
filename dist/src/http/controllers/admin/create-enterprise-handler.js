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
exports.createEnterpriseHandler = createEnterpriseHandler;
const make_create_enterprise_input_use_case_1 = require("@/use-cases/factories/admin/make-create-enterprise-input-use-case");
const zod_1 = require("zod");
const createEnterpriseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'O nome é obrigatório.'),
    description: zod_1.z.string().min(1, 'A descrição é obrigatória.'),
    investmentType: zod_1.z.enum(['MONEY', 'PROPERTY'], {
        errorMap: () => ({ message: 'O tipo de investimento deve ser MONEY ou PROPERTY.' }),
    }),
    isAvailable: zod_1.z.boolean(),
    currentPhaseId: zod_1.z.number().int().positive().optional(),
    currentTaskId: zod_1.z.number().int().positive().optional(),
    constructionType: zod_1.z.string().min(1, 'O tipo de construção é obrigatório.'),
    fundingAmount: zod_1.z.number().positive('O valor de aporte deve ser maior que zero.'),
    transferAmount: zod_1.z.number().positive('O valor repassado deve ser maior que zero.'),
    postalCode: zod_1.z.string().min(1, 'O código postal é obrigatório.'),
    city: zod_1.z.string().min(1, 'A cidade é obrigatória.'),
    squareMeterValue: zod_1.z.number().positive('O valor por metro quadrado deve ser maior que zero.'),
    area: zod_1.z.number().positive('A metragem total deve ser maior que zero.'),
    floors: zod_1.z.number().int().positive().optional(),
    completionDate: zod_1.z.coerce.date().optional(),
});
function createEnterpriseHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedBody = createEnterpriseSchema.parse(request.body);
            console.log('Dados validados:', validatedBody);
            const createEnterpriseUseCase = (0, make_create_enterprise_input_use_case_1.makeCreateEnterpriseUseCase)();
            const enterprise = yield createEnterpriseUseCase.execute(validatedBody);
            reply.status(201).send({
                message: 'Empreendimento criado com sucesso.',
                enterprise,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                console.error('Erro de validação:', error.errors);
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
