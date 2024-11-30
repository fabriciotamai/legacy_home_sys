import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    
    if (!authHeader) {
      return reply.status(401).send({ error: 'Token ausente' });
    }

    const token = authHeader.split(' ')[1];

    
    const payload = verifyToken(token);

    if (!payload) {
      return reply.status(401).send({ error: 'Token inválido ou expirado' });
    }

    
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      return reply.status(401).send({ error: 'Usuário não encontrado.' });
    }

    
    if (user.tokenVersion !== payload.tokenVersion) {
      return reply.status(401).send({ error: 'Token inválido ou expirado.' });
    }

    
    request.user = payload;
  } catch (error) {
    
    return reply.status(401).send({ error: 'Falha na autenticação.' });
  }
}
