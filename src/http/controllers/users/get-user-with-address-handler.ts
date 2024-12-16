import { makeGetUserWithAddress } from '@/use-cases/factories/users/make-get-user-with-address-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getUserWithAddressHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    if (!request.user || !request.user.id) {
      console.error('Erro: Usuário não autenticado ou ID ausente.');
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const userId = request.user.id;

    const getUserWithAddressUseCase = makeGetUserWithAddress();

    const userWithAddress = await getUserWithAddressUseCase.execute(userId);

    reply.status(200).send(userWithAddress);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro inesperado no handler:', error.message);
      return reply.status(500).send({ error: 'Erro inesperado.' });
    }

    return reply.status(500).send({ error: 'Erro desconhecido.' });
  }
}
