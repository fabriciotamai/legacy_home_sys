var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function roleMiddleware(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.user) {
            return reply.status(401).send({ error: 'Usuário não autenticado.' });
        }
        if (request.user.role !== 'ADMIN') {
            return reply.status(403).send({ error: 'Acesso negado. Apenas administradores podem realizar essa ação.' });
        }
    });
}
