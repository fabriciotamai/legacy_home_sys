import { makeGetAllEnterprisesUseCase } from '@/use-cases/factories/admin/make-get-all-enterprise-use-case';
import { EnterpriseStatus } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const getAllEnterprisesQuerySchema = z.object({
  status: z
    .enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
    .optional(),
  investmentType: z.enum(['MONEY', 'PROPERTY']).optional(),
  isAvailable: z.boolean().optional(),
});

export async function getAllEnterprisesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const filters = getAllEnterprisesQuerySchema.parse(request.query);

    const status = filters.status as EnterpriseStatus | undefined;

    const getAllEnterprisesUseCase = makeGetAllEnterprisesUseCase();

    const enterprises = await getAllEnterprisesUseCase.execute({
      status,
      investmentType: filters.investmentType,
      isAvailable: filters.isAvailable,
    });

    reply.status(200).send({
      message: 'Empreendimentos recuperados com sucesso.',
      enterprises,
    });
  } catch (error) {
    console.error('Erro ao buscar empreendimentos:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
