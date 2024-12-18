import { makeGetUserEnterprisesUseCase } from '@/use-cases/factories/users/make-get-user-enterprise-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getUserEnterprisesHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(400).send({ message: 'Usuário não autenticado.' });
    }

    const getUserEnterprisesUseCase = makeGetUserEnterprisesUseCase();
    const enterprises = await getUserEnterprisesUseCase.execute({ userId });

    reply.status(200).send(enterprises);
  } catch (error: any) {
    if (error.status && error.message) {
      reply.status(error.status).send({ message: error.message });
    } else {
      console.error('Erro inesperado:', error);
      reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }
}
