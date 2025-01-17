import { makeGeneratePasswordResetCodeUseCase } from '@/use-cases/factories/users/make-gererate-code-reset-password-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function generatePasswordResetCodeHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const schema = z.object({
    email: z.string().email('E-mail inválido.'),
  });

  try {
    const { email } = schema.parse(request.body);

    const useCase = makeGeneratePasswordResetCodeUseCase();
    await useCase.execute({ email });

    reply.status(200).send({ message: 'Código de recuperação enviado.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      return reply.status(400).send({ errors: error.errors });
    }

    if (error instanceof Error) {
      console.error('Erro inesperado no handler:', error.message);
      return reply.status(500).send({ error: 'Erro inesperado.' });
    }

    return reply.status(500).send({ error: 'Erro desconhecido.' });
  }
}
