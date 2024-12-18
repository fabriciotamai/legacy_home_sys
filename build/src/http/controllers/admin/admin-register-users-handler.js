var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeAdminRegisterUsers } from '@/use-cases/factories/admin/make-admin-register-users';
import { Role } from '@prisma/client';
import { z } from 'zod';
export function adminRegisterUsersHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminRegisterUsersSchema = z.object({
            email: z.string().email('E-mail inválido.'),
            username: z.string().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres.'),
            password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
            firstName: z.string().min(1, 'O primeiro nome é obrigatório.'),
            lastName: z.string().min(1, 'O sobrenome é obrigatório.'),
            birthDate: z
                .string()
                .optional()
                .refine((value) => {
                if (!value)
                    return true;
                const date = new Date(value);
                return !isNaN(date.getTime());
            }, { message: 'Data de nascimento inválida.' }),
            userType: z.enum(['INDIVIDUAL', 'BUSINESS']).refine((value) => ['INDIVIDUAL', 'BUSINESS'].includes(value), {
                message: 'O tipo de usuário é inválido.',
            }),
            numberDocument: z.string().optional(),
            phone: z.string().optional(),
            role: z.nativeEnum(Role, {
                errorMap: () => ({ message: 'O campo role é inválido.' }),
            }),
        });
        try {
            const validatedData = adminRegisterUsersSchema.parse(request.body);
            const adminRegisterUsersUseCase = makeAdminRegisterUsers();
            yield adminRegisterUsersUseCase.execute(Object.assign(Object.assign({}, validatedData), { birthDate: validatedData.birthDate ? new Date(validatedData.birthDate).toISOString() : undefined }));
            reply.status(201).send({ message: 'Usuário registrado com sucesso!' });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                reply.status(400).send({ errors: error.errors });
            }
            else if (error instanceof Error) {
                reply.status(400).send({ error: error.message });
            }
            else {
                reply.status(500).send({ error: 'Erro interno do servidor.' });
            }
        }
    });
}
