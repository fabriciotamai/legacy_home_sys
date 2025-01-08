// src/handlers/faq/admin-delete-faq-category-handler.ts

import { makeDeleteFaqCategory } from '@/use-cases/factories/admin/make-delete-faq-category-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';


//
const categoryParamsSchema = z.object({
  categoryId: z
    .string()
    .regex(/^\d+$/, 'Category ID must be a positive integer.')
    .transform((val) => parseInt(val, 10)),
});

export async function adminDeleteFaqCategoryHandler(
  request: FastifyRequest, 
  reply: FastifyReply
): Promise<void> {
  try {
    
    const validatedParams = categoryParamsSchema.parse(request.params);

    
    const deleteFaqCategoryUseCase = makeDeleteFaqCategory();
    await deleteFaqCategoryUseCase.execute(validatedParams.categoryId);

    
    reply.status(200).send({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      
      reply.status(400).send({ errors: error.errors });
    } else {
      
      console.error('Error deleting category:', error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
