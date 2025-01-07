import { makeAcceptOrRejectComplianceUseCase } from '@/use-cases/factories/admin/make-accept-or-reject-compliance-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const acceptOrRejectComplianceBodySchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
});

const acceptOrRejectComplianceParamsSchema = z.object({
  userId: z.coerce
    .number()
    .positive('O ID do usuário deve ser um número positivo.'),
});

export async function acceptOrRejectComplianceHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { userId } = acceptOrRejectComplianceParamsSchema.parse(
      request.params,
    );
    const { status, reason } = acceptOrRejectComplianceBodySchema.parse(
      request.body,
    );

    const acceptOrRejectComplianceUseCase =
      makeAcceptOrRejectComplianceUseCase();
    const result = await acceptOrRejectComplianceUseCase.execute({
      userId,
      status,
      reason,
    });

    reply.status(200).send({
      message: result.message,
    });
  } catch (error) {
    console.error('Erro ao processar compliance:', error);

    if (error instanceof z.ZodError) {
      reply.status(422).send({
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    } else {
      reply.status(400).send({
        error: error instanceof Error ? error.message : 'Erro inesperado.',
      });
    }
  }
}
