// src/handlers/faq/admin-list-faqs-handler.ts

import { makeListFaqs } from '@/use-cases/factories/admin/make-list-faq-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminListFaqsHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const schema = z.object({
    categoryId: z.number().optional()
  });

  try {
    const query = schema.parse(request.query);
    const listFaqsUseCase = makeListFaqs();
    const faqs = await listFaqsUseCase.execute(query.categoryId);

    reply.status(200).send({
      message: 'FAQs listadas com sucesso',
      faqs
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else {
      console.error('Erro ao listar FAQs:', error);
      reply.status(500).send({ error: 'Erro interno ao buscar FAQs.' });
    }
  }
}
