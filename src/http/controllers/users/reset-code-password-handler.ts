import { makeResetPasswordUseCase } from '@/use-cases/factories/users/make-validade-password-reset-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function resetPasswordHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const resetPasswordSchema = z.object({
    email: z.string().email('E-mail inválido.'),
    code: z.string().length(4, 'O código deve ter exatamente 4 dígitos.'),
    newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
  });

  try {
    const { email, code, newPassword } = resetPasswordSchema.parse(request.body);

    const resetPasswordUseCase = makeResetPasswordUseCase();
    await resetPasswordUseCase.execute({ email, code, newPassword });

    reply.status(200).send({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Erro interno do servidor.' });
    }
  }
}
