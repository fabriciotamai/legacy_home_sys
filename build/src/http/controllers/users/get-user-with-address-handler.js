var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeGetUserWithAddress } from '@/use-cases/factories/users/make-get-user-with-address-use-case';
export function getUserWithAddressHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!request.user || !request.user.id) {
                console.error('Erro: Usuário não autenticado ou ID ausente.');
                return reply.status(401).send({ error: 'Usuário não autenticado.' });
            }
            const userId = request.user.id;
            const getUserWithAddressUseCase = makeGetUserWithAddress();
            const userWithAddress = yield getUserWithAddressUseCase.execute(userId);
            reply.status(200).send(userWithAddress);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Erro inesperado no handler:', error.message);
                return reply.status(500).send({ error: 'Erro inesperado.' });
            }
            return reply.status(500).send({ error: 'Erro desconhecido.' });
        }
    });
}
