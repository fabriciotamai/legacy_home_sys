import { makeValidateEmailUseCase } from '@/use-cases/factories/users/make-validate-email-use.case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validateEmailHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const validateEmailSchema = z.object({
    emailCode: z.string().length(4, 'O código deve ter exatamente 4 dígitos.'),
  });

  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const validatedData = validateEmailSchema.parse(request.body);

    const validateEmailUseCase = makeValidateEmailUseCase();

    const { token } = await validateEmailUseCase.execute({
      userId,
      emailCode: validatedData.emailCode,
    });

    reply.status(200).send({ message: 'E-mail validado com sucesso!', token });
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
