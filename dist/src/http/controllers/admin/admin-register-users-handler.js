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
exports.adminRegisterUsersHandler = adminRegisterUsersHandler;
const make_admin_register_users_1 = require("@/use-cases/factories/admin/make-admin-register-users");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
function adminRegisterUsersHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminRegisterUsersSchema = zod_1.z.object({
            email: zod_1.z.string().email('E-mail inválido.'),
            username: zod_1.z.string().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres.'),
            password: zod_1.z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
            firstName: zod_1.z.string().min(1, 'O primeiro nome é obrigatório.'),
            lastName: zod_1.z.string().min(1, 'O sobrenome é obrigatório.'),
            birthDate: zod_1.z.string().optional().refine((value) => {
                if (!value)
                    return true;
                const date = new Date(value);
                return !isNaN(date.getTime());
            }, { message: 'Data de nascimento inválida.' }),
            userType: zod_1.z.enum(['INDIVIDUAL', 'BUSINESS']).refine((value) => ['INDIVIDUAL', 'BUSINESS'].includes(value), { message: 'O tipo de usuário é inválido.' }),
            numberDocument: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional(),
            role: zod_1.z.nativeEnum(client_1.Role, { errorMap: () => ({ message: 'O campo role é inválido.' }) }),
        });
        try {
            const validatedData = adminRegisterUsersSchema.parse(request.body);
            const adminRegisterUsersUseCase = (0, make_admin_register_users_1.makeAdminRegisterUsers)();
            yield adminRegisterUsersUseCase.execute(Object.assign(Object.assign({}, validatedData), { birthDate: validatedData.birthDate ? new Date(validatedData.birthDate).toISOString() : undefined }));
            reply.status(201).send({ message: 'Usuário registrado com sucesso!' });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
