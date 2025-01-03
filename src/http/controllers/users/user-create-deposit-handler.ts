import { makeCreateDepositUseCase } from '@/use-cases/factories/users/make-user-deposit-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function createDepositHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const createDepositSchema = z.object({
    amount: z.number().positive('O valor do depósito deve ser maior que zero.'),
  });

  try {
    const userId = request.user?.id;

    if (!userId) {
      reply.status(401).send({ error: 'Usuário não autenticado.' });
      return;
    }

    const validatedData = createDepositSchema.parse(request.body);

    const createDepositUseCase = makeCreateDepositUseCase();
    const result = await createDepositUseCase.execute({
      userId,
      amount: validatedData.amount,
    });

    reply.status(201).send({
      message: result.message,
      deposit: {
        id: result.deposit.id,
        codeDeposit: result.deposit.codeDeposit,
        amount: result.deposit.amount,
        status: result.deposit.status,
        createdAt: result.deposit.createdAt,
      },
    });
  } catch (error) {
    console.error('Erro ao criar depósito:', error);

    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Erro inesperado.',
      });
    }
  }
}
