import { makeGetEnterprisesWithInterestsUseCase } from '@/use-cases/factories/admin/make-get-interest-enterprise-user-use-case';

import { FastifyReply, FastifyRequest } from 'fastify';

export async function getEnterprisesWithInterestsHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const getEnterprisesWithInterestsUseCase = makeGetEnterprisesWithInterestsUseCase();

    const enterprises = await getEnterprisesWithInterestsUseCase.execute();

    reply.status(200).send({
      message: 'Empreendimentos com interesse recuperados com sucesso.',
      enterprises,
    });
  } catch (error) {
    console.error('Erro ao buscar empreendimentos com interesse:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
