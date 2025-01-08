
import { makeCreateFaqCategory } from '@/use-cases/factories/admin/make-create-faq-category-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminCreateFaqCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const schema = z.object({
    name: z.string().min(1, 'O nome da categoria não pode estar vazio.')
  });

  try {
    const { name } = schema.parse(request.body);
    const createFaqCategoryUseCase = makeCreateFaqCategory();
    const faqCategory = await createFaqCategoryUseCase.execute({ name });

    reply
      .status(201)
      .send({
        message: 'Categoria de FAQ criada com sucesso!',
        faqCategory,
      });
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
