import { makeAcceptOrRejectInterestUseCase } from '@/use-cases/factories/admin/make-accept-or-reject-enterprise-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const acceptOrRejectZodSchema = z.object({
  interestId: z.string().length(8),
  status: z.enum(['APPROVED', 'REJECTED']),
});

export async function acceptOrRejectInterestHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { interestId, status } = acceptOrRejectZodSchema.parse(request.body);

    const acceptOrRejectInterestUseCase = makeAcceptOrRejectInterestUseCase();
    const updatedInterest = await acceptOrRejectInterestUseCase.execute({
      interestId,
      status,
    });

    reply.status(200).send({
      message: 'Interesse atualizado com sucesso.',
      updatedInterest,
    });
  } catch (error) {
    console.error('Erro ao processar interesse:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
