var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeGetUserEnterprisesUseCase } from '@/use-cases/factories/users/make-get-user-enterprise-use-case';
export function getUserEnterprisesHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return reply.status(400).send({ message: 'Usuário não autenticado.' });
            }
            const getUserEnterprisesUseCase = makeGetUserEnterprisesUseCase();
            const enterprises = yield getUserEnterprisesUseCase.execute({ userId });
            reply.status(200).send(enterprises);
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
