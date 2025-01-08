// src/handlers/faq/admin-delete-faq-handler.ts

import { makeDeleteFaq } from '@/use-cases/factories/admin/make-delete-faq-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';


const faqParamsSchema = z.object({
  faqId: z
    .string()
    .regex(/^\d+$/, 'FAQ ID deve ser um número inteiro positivo.')
    .transform((val) => parseInt(val, 10)),
});

export async function adminDeleteFaqHandler(
  request: FastifyRequest, 
  reply: FastifyReply
): Promise<void> {
  try {
    const validatedParams = faqParamsSchema.parse(request.params);
    const deleteFaqUseCase = makeDeleteFaq();
    await deleteFaqUseCase.execute(validatedParams.faqId);
    reply.status(200).send({ message: 'FAQ deletada com sucesso' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else {
      console.error('Erro ao deletar FAQ:', error);
      reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }
}
