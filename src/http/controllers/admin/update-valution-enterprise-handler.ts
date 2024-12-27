import { makeUpdateEnterpriseValuationUseCase } from '@/use-cases/factories/admin/make-update-valution-enterprise-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const updateEnterpriseValuationBodySchema = z.object({
  newValuation: z.number(),
  mode: z.enum(['consulting', 'confirmed']),
});

const updateEnterpriseValuationParamsSchema = z.object({
  enterpriseId: z.coerce.number(),
});

export async function updateEnterpriseValuationHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { enterpriseId } = updateEnterpriseValuationParamsSchema.parse(request.params);

    const { newValuation, mode } = updateEnterpriseValuationBodySchema.parse(request.body);

    const updateEnterpriseValuationUseCase = makeUpdateEnterpriseValuationUseCase();

    const result = await updateEnterpriseValuationUseCase.execute({
      enterpriseId,
      newValuation,
      mode,
    });

    reply.status(200).send({
      message:
        mode === 'consulting' ? 'Consulta realizada com sucesso.' : 'Valorização/desvalorização aplicada com sucesso.',
      data: result,
    });
  } catch (error) {
    console.error('Erro ao atualizar valorização do empreendimento:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
