import { makeUpdateEnterpriseUseCase } from '@/use-cases/factories/admin/make-update-enteprise-use-case';
import { ConstructionType, EnterpriseStatus, InvestmentType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminUpdateEnterpriseHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const paramsSchema = z.object({
    enterpriseId: z.string().regex(/^\d+$/, 'O ID do empreendimento deve ser um número válido.'),
  });
  const updateEnterpriseSchema = z.object({
    name: z.string().min(1, 'O nome do empreendimento é obrigatório.').optional(),
    corporateName: z.string().optional(),
    description: z.string().optional(),
    status: z.nativeEnum(EnterpriseStatus).optional(),
    isAvailable: z.boolean().optional(),
    investmentType: z.nativeEnum(InvestmentType).optional(),
    constructionType: z.nativeEnum(ConstructionType).optional(),
    fundingAmount: z.number().positive().optional(),
    transferAmount: z.number().positive().optional(),
    squareMeterValue: z.number().positive().optional(),
    area: z.number().positive().optional(),
    progress: z.number().min(0).max(100).optional(),
    floors: z.number().optional(),
    completionDate: z.string().optional(),
    startDate: z.string().optional(),
    forceUpdate: z.boolean().optional().default(false), 
  });

  try {
    if (!request.user || request.user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Acesso negado.' });
    }
    const { enterpriseId } = paramsSchema.parse(request.params);
    const updateData = updateEnterpriseSchema.parse(request.body);

    const updateEnterpriseUseCase = makeUpdateEnterpriseUseCase();
    
    try {
      const updatedEnterprise = await updateEnterpriseUseCase.execute({
        enterpriseId: Number(enterpriseId),
        data: updateData,
        forceUpdate: updateData.forceUpdate, 
      });

      reply.status(200).send({
        message: 'Empreendimento atualizado com sucesso!',
        enterprise: updatedEnterprise,
      });

    } catch (error) {
      if (error instanceof Error && error.message.includes('Impacto nos investidores')) {
        return reply.status(409).send({ error: error.message });
      }
      throw error;
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    console.error('Erro inesperado ao atualizar empreendimento:', error);
    return reply.status(500).send({ error: 'Erro inesperado ao atualizar empreendimento.' });
  }
}
