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
exports.authMiddleware = authMiddleware;
const prisma_users_repository_1 = require("@/repositories/prisma/prisma-users-repository");
const auth_service_1 = require("@/services/auth-service");
const userRepository = new prisma_users_repository_1.PrismaUsersRepository();
const authService = new auth_service_1.AuthService(userRepository);
function authMiddleware(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                console.error('Erro: Token ausente ou mal formatado.');
                return reply.status(401).send({ error: 'Token ausente ou inválido.' });
            }
            const token = authHeader.split(' ')[1];
            const payload = authService.validateToken(token);
            if (!payload) {
                console.error('Erro: Token inválido.');
                return reply.status(401).send({ error: 'Token inválido ou expirado.' });
            }
            const user = yield authService.getUserById(payload.id);
            if (!user) {
                console.error('Erro: Usuário não encontrado.');
                return reply.status(401).send({ error: 'Usuário não encontrado.' });
            }
            if (!authService.isTokenVersionValid(payload.tokenVersion, user.tokenVersion)) {
                console.error(`Erro: Versão do token inválida. Payload: ${payload.tokenVersion}, Banco: ${user.tokenVersion}`);
                return reply.status(401).send({ error: 'Token inválido ou expirado.' });
            }
            request.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                tokenVersion: user.tokenVersion,
            };
        }
        catch (error) {
            console.error('Erro inesperado no middleware de autenticação:', error);
            return reply.status(401).send({ error: 'Falha na autenticação.' });
        }
    });
}
