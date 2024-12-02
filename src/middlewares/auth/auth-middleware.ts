import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthService } from '@/services/auth-service';
import { FastifyReply, FastifyRequest } from 'fastify';

const userRepository = new PrismaUsersRepository();
const authService = new AuthService(userRepository);

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
 

  try {
    const authHeader = request.headers.authorization;
   

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      console.error('Erro: Token ausente ou mal formatado.');
      return reply.status(401).send({ error: 'Token ausente ou inválido.' });
    }

    const token = authHeader.split(' ')[1];
   

    const payload = authService.validateToken(token);
   

    const user = await authService.getUserById(payload.id);
    if (!user) {
    
      return reply.status(401).send({ error: 'Usuário não encontrado.' });
    }

    if (!authService.isTokenVersionValid(payload.tokenVersion, user.tokenVersion)) {
      
      return reply.status(401).send({ error: 'Token inválido ou expirado.' });
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

   
  } catch (error) {
  
    return reply.status(401).send({ error: 'Falha na autenticação.' });
  }
}
