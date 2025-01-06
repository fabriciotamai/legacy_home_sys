import { makeApproveOrRejectDepositUseCase } from '@/use-cases/factories/admin/make-approve-or-reject-deposit-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminApproveOrRejectDepositHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const schema = z.object({
    depositId: z.number().min(1, 'ID do depósito inválido.'),
    status: z.enum(['APPROVED', 'REJECTED']),
    adminComment: z.string().optional(),
  });

  try {
    const { depositId, status, adminComment } = schema.parse(request.body);

    const useCase = makeApproveOrRejectDepositUseCase();
    const { deposit } = await useCase.execute({ depositId, status, adminComment });

    reply.status(200).send({ message: `Depósito ${status.toLowerCase()} com sucesso!`, deposit });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      return reply.status(400).send({ errors: error.errors });
    }

    if (error instanceof Error) {
      console.error('Erro inesperado no handler:', error.message);
      return reply.status(500).send({ error: error.message });
    }

    return reply.status(500).send({ error: 'Erro desconhecido.' });
  }
}
