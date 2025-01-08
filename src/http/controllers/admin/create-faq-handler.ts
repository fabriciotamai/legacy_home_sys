import { makeCreateFaq } from '@/use-cases/factories/admin/make-create-faq-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminCreateFaqHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const schema = z.object({
    question: z.string().min(1, 'A pergunta não pode estar vazia.'),
    answer: z.string().min(1, 'A resposta não pode estar vazia.'),
    categoryId: z.number().positive('O ID da categoria deve ser um número positivo.'), 
  });

  try {
    
    const { question, answer, categoryId } = schema.parse(request.body);

    const createFaqUseCase = makeCreateFaq();
    
    const faq = await createFaqUseCase.execute({ question, answer, categoryId });

    reply
      .status(201)
      .send({
        message: 'FAQ criada com sucesso!',
        faq,
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
