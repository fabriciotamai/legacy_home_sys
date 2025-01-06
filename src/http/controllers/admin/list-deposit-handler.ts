import { makeListDepositsUseCase } from '@/use-cases/factories/admin/make-list-deposit-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminListDepositsHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const listDepositsSchema = z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'WAITING_PROOF']).optional(),
  });

  try {
    const query = request.query as any; // Captura a query string
    const { status } = listDepositsSchema.parse(query); // Valida o status enviado

    const listDepositsUseCase = makeListDepositsUseCase();
    const { deposits } = await listDepositsUseCase.execute(status);

    reply.status(200).send({ deposits });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else {
      console.error('Erro ao listar depósitos:', error);
      reply.status(500).send({ error: 'Erro ao buscar depósitos.' });
    }
  }
}
