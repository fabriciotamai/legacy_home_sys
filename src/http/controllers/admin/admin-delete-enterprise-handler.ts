

import { makeDeleteEnterpriseUseCase } from '@/use-cases/factories/admin/make-delete-enterprise-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';


const enterpriseParamsSchema = z.object({
  enterpriseId: z
    .string()
    .regex(/^\d+$/, 'Enterprise ID must be a positive integer.')
    .transform((val) => parseInt(val, 10)),
});

export async function adminDeleteEnterpriseHandler(
  request: FastifyRequest, 
  reply: FastifyReply
): Promise<void> {
  try {

    const validatedParams = enterpriseParamsSchema.parse(request.params);


    const deleteEnterpriseUseCase = makeDeleteEnterpriseUseCase();
    await deleteEnterpriseUseCase.execute({ enterpriseId: validatedParams.enterpriseId });

 
    reply.status(200).send({ message: 'Enterprise deleted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Erros de validação
      reply.status(400).send({ errors: error.errors });
    } else {
   
      console.error('Error deleting enterprise:', error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
