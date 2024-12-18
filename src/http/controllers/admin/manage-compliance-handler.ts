import { makeManageComplianceUseCase } from '@/use-cases/factories/admin/make-manage-compliance-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function manageComplianceHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const manageComplianceSchema = z.object({
    action: z.enum(['approve', 'reject']),
    reason: z.string().optional(),
  });

  try {
    const { userId } = request.params as { userId: string };

    const body = manageComplianceSchema.parse(request.body);

    const manageComplianceUseCase = makeManageComplianceUseCase();

    await manageComplianceUseCase.execute({
      userId: parseInt(userId, 10),
      action: body.action,
      reason: body.reason,
    });

    reply.status(200).send({
      message: body.action === 'approve' ? 'Compliance aprovado com sucesso.' : 'Compliance rejeitado com sucesso.',
    });
  } catch (error) {
    console.error('Erro ao gerenciar compliance:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
