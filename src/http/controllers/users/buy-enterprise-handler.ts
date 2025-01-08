import { makeBuyDirectUseCase } from '@/use-cases/factories/users/make-buy-interprise-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function buyEntepriseHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const buyDirectSchema = z.object({
    enterpriseId: z
      .number()
      .int()
      .positive('O ID do empreendimento deve ser um número positivo.'),
  });

  try {
    
    const { enterpriseId } = buyDirectSchema.parse(request.body);
    
    const userId = request.user!.id; 

    const buyDirectUseCase = makeBuyDirectUseCase();
    const contractInterest = await buyDirectUseCase.execute({
      userId,
      enterpriseId,
    });
    
    reply.status(201).send({
      message: 'Compra direta realizada com sucesso.',
      contractInterest,
    });
  } catch (error: any) {

    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      return reply.status(400).send({ errors: error.errors });
    }

    console.error('Erro inesperado no handler:', error);
    reply.status(500).send({ error: 'Erro inesperado.' });
  }
}
