import { makeUpdateWalletBalanceUseCase } from '@/use-cases/factories/admin/make-update-wallet-balance-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const paramsSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, {
      message: 'O ID do usuário deve ser um número inteiro positivo.',
    }),
});

const bodySchema = z.object({
  amount: z
    .number()
    .refine((value) => value !== 0, {
      message: 'O valor deve ser diferente de zero.',
    }),
  description: z.string().optional(),
});

export async function updateWalletBalanceHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { userId } = paramsSchema.parse(request.params);

    const { amount, description } = bodySchema.parse(request.body);

    const useCase = makeUpdateWalletBalanceUseCase();
    const result = await useCase.execute({
      userId: parseInt(userId, 10),
      amount,
      description,
    });

    reply.status(200).send({
      message: 'Saldo atualizado com sucesso.',
      newBalance: result.newBalance,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(422).send({
        message: 'Erro de validação.',
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    reply.status(400).send({
      message:
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao atualizar saldo.',
    });
  }
}
