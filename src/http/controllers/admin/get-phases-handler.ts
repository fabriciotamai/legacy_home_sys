import { makeGetPhasesUseCase } from '@/use-cases/factories/admin/make-get-phases-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getPhasesHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const getPhasesUseCase = makeGetPhasesUseCase();

    const phases = await getPhasesUseCase.execute();

    reply.status(200).send({
      message: 'Fases recuperadas com sucesso.',
      phases,
    });
  } catch (error) {
    console.error('Erro ao buscar fases:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
