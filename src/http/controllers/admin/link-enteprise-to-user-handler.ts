import { makeLinkUserToEnterpriseUseCase } from '@/use-cases/factories/admin/make-link-enterprise-to-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const linkEnterpriseToUserSchema = z.object({
  userId: z.number().int().positive(),
  enterpriseId: z.number().int().positive(),
});

export async function linkEnterpriseToUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const input = linkEnterpriseToUserSchema.parse(request.body);

    const linkUserToEnterpriseUseCase = makeLinkUserToEnterpriseUseCase();

    const contractInterest = await linkUserToEnterpriseUseCase.execute(input);

    reply.status(201).send({
      message: 'Usuário vinculado ao empreendimento com sucesso.',
      contractInterest,
    });
  } catch (error) {
    console.error('Erro ao vincular usuário ao empreendimento:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
