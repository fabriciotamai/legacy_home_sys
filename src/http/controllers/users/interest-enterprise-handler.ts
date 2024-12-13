import { makeInterestEnterpriseUseCase } from '@/use-cases/factories/users/make-interest-enterprise-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function interestEnterpriseHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const interestSchema = z.object({
    enterpriseId: z.number(), 
  });

  try {
    const { enterpriseId } = interestSchema.parse(request.body);

    const interestEnterpriseUseCase = makeInterestEnterpriseUseCase();

    
    const effectiveUserId = request.user?.id;

    if (!effectiveUserId) {
      return reply.status(400).send({ message: 'Usuário não autenticado.' });
    }

    const result = await interestEnterpriseUseCase.execute({
      userId: effectiveUserId,
      enterpriseId,
    });

    reply.status(200).send(result);
  } catch (error: any) {
    if (error.status && error.message) {
      reply.status(error.status).send({ message: error.message });
    } else {
      console.error('Erro inesperado:', error);
      reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }
}
