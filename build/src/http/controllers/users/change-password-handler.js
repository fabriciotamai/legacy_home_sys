var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeChangePassword } from '@/use-cases/factories/users/make-change-password-use-case';
import { z } from 'zod';
export function changePasswordHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const changePasswordSchema = z.object({
            currentPassword: z.string().min(6, 'A senha atual deve ter pelo menos 6 caracteres.'),
            newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
        });
        try {
            if (!request.user) {
                console.error('Erro: Usuário não autenticado.');
                return reply.status(401).send({ error: 'Usuário não autenticado.' });
            }
            const { currentPassword, newPassword } = changePasswordSchema.parse(request.body);
            const userId = request.user.id;
            const changePasswordUseCase = makeChangePassword();
            yield changePasswordUseCase.execute({ userId, currentPassword, newPassword });
            reply.status(200).send({ message: 'Senha alterada com sucesso.' });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Erro de validação:', error.errors);
                return reply.status(400).send({ errors: error.errors });
            }
            if (error instanceof Error) {
                console.error('Erro inesperado no handler:', error.message);
                return reply.status(500).send({ error: 'Erro inesperado.' });
            }
            return reply.status(500).send({ error: 'Erro desconhecido.' });
        }
    });
}
