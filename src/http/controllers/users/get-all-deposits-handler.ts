import { makeGetAllDepositsUseCase } from '@/use-cases/factories/users/make-get-all-deposits-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getAllDepositsHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(400).send({ message: 'Usuário não autenticado.' });
    }

    const getAllDepositsUseCase = makeGetAllDepositsUseCase();
    const deposits = await getAllDepositsUseCase.execute({ userId });

    reply.status(200).send(deposits);
  } catch (error: any) {
    if (error.status && error.message) {
      reply.status(error.status).send({ message: error.message });
    } else {
      console.error('Erro inesperado:', error);
      reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }
}
