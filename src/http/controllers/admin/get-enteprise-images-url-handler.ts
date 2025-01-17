// src/controllers/enterprise-controller.ts

import { makeGetEnterpriseImageUrlsUseCase } from '@/use-cases/factories/admin/make-get-enterprise-images-urls-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';


export async function getEnterpriseImageUrlsHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    
    const paramsSchema = z.object({
      enterpriseId: z
        .string()
        .regex(/^\d+$/, 'enterpriseId deve ser um número')
        .transform(Number),
    });

    
    const querySchema = z.object({
      page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => !isNaN(val) && val >= 1, {
          message: 'page deve ser um número inteiro maior ou igual a 1',
        }),
      limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => !isNaN(val) && val >= 1, {
          message: 'limit deve ser um número inteiro maior ou igual a 1',
        }),
    });

    
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) {
      const errorMessages = parsedParams.error.errors.map((err) => err.message).join(', ');
      return reply.status(400).send({ error: errorMessages });
    }
    const { enterpriseId } = parsedParams.data;

    
    const parsedQuery = querySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      const errorMessages = parsedQuery.error.errors.map((err) => err.message).join(', ');
      return reply.status(400).send({ error: errorMessages });
    }
    const { page, limit } = parsedQuery.data;

    
    const getEnterpriseImageUrlsUseCase = makeGetEnterpriseImageUrlsUseCase();

    
    const { images, coverImageUrl, total, page: currentPage, limit: currentLimit, totalPages } =
    await getEnterpriseImageUrlsUseCase.execute({
      enterpriseId,
      page,
      limit,
    });
  
    reply.status(200).send({
      images,
      coverImageUrl, 
      pagination: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error('Erro ao recuperar URLs das imagens do empreendimento:', error);
    reply.status(500).send({ error: error.message || 'Erro inesperado.' });
  }
}
