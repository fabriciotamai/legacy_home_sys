import { makeGetEnterprisesAvailableUseCase } from '@/use-cases/factories/users/make-get-enterprise-available-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function getEnterprisesAvailableHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const filterSchema = z.object({
    status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
    investmentType: z.enum(['MONEY', 'PROPERTY']).optional(),
    isAvailable: z.boolean().optional(),
  });

  try {
    const filters = filterSchema.parse(request.query);

    const getEnterprisesUseCase = makeGetEnterprisesAvailableUseCase();

    const enterprises = await getEnterprisesUseCase.execute(filters);

    reply.status(200).send(enterprises);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ message: 'Parâmetros inválidos.', errors: error.errors });
    } else {
      console.error('Erro inesperado:', error);
      reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }
}
