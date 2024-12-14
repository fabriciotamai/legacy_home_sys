var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeGetPhasesUseCase } from '@/use-cases/factories/admin/make-get-phases-use-case';
export function getPhasesHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getPhasesUseCase = makeGetPhasesUseCase();
            const phases = yield getPhasesUseCase.execute();
            reply.status(200).send({
                message: 'Fases recuperadas com sucesso.',
                phases,
            });
        }
        catch (error) {
            console.error('Erro ao buscar fases:', error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : 'Erro inesperado.',
            });
        }
    });
}
