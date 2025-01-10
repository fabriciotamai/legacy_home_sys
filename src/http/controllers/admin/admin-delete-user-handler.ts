import { makeDeleteUserUseCase } from '@/use-cases/factories/admin/make-admin-delete-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';


const userParamsSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, 'User ID deve ser um número positivo.')
    .transform((val) => parseInt(val, 10)),
});

export async function adminDeleteUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const validatedParams = userParamsSchema.parse(request.params);

    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute(validatedParams.userId);

    reply.status(200).send({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else {
      console.error('Erro ao deletar usuário:', error);
      reply.status(500).send({ error: 'Erro interno do servidor.' });
    }
  }
}
