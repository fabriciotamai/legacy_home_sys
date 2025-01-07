import { FastifyReply, FastifyRequest } from 'fastify';

export async function roleMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!request.user) {
    return reply.status(401).send({ error: 'Usuário não autenticado.' });
  }
  if (request.user.role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Acesso negado. Apenas administradores podem realizar essa ação.' });
  }
}
