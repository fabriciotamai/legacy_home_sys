import { makeGetAllUsersUseCase } from '@/use-cases/factories/admin/make-get-all-users-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getAllUsersHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const getAllUsersUseCase = makeGetAllUsersUseCase();

    const users = await getAllUsersUseCase.execute();

    reply.status(200).send({
      message: 'Usuários recuperados com sucesso.',
      users,
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
