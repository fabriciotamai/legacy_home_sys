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
exports.getAllEnterprisesHandler = getAllEnterprisesHandler;
const make_get_all_enterprise_use_case_1 = require("@/use-cases/factories/admin/make-get-all-enterprise-use-case");
const zod_1 = require("zod");
const getAllEnterprisesQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
    investmentType: zod_1.z.enum(['MONEY', 'PROPERTY']).optional(),
    isAvailable: zod_1.z.boolean().optional(),
});
function getAllEnterprisesHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = getAllEnterprisesQuerySchema.parse(request.query);
            const status = filters.status;
            const getAllEnterprisesUseCase = (0, make_get_all_enterprise_use_case_1.makeGetAllEnterprisesUseCase)();
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
