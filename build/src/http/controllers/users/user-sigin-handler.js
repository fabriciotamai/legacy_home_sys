var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeUserSignin } from '@/use-cases/factories/users/make-signin-users-use-case';
import { z } from 'zod';
export function userSiginHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginSchema = z.object({
            email: z.string().email('E-mail inválido.'),
            password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
        });
        try {
            const { email, password } = loginSchema.parse(request.body);
            const loginUseCase = makeUserSignin();
            const result = yield loginUseCase.execute({ email, password });
            reply.status(200).send(result);
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
