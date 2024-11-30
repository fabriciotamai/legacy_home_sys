import { verifyToken } from '@/utils/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ error: 'Token ausente' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return reply.status(401).send({ error: 'Token inválido ou expirado' });
  }

  request.user = payload;
}
