import { makeGenerateEmailCodeUseCase } from '@/use-cases/factories/users/make-generate-email-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function generateEmailCodeHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const generateEmailCodeUseCase = makeGenerateEmailCodeUseCase();

    await generateEmailCodeUseCase.execute({ userId });

    reply.status(200).send({ message: 'Código de e-mail gerado e enviado com sucesso!' });
  } catch (error) {
    if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Erro interno do servidor.' });
    }
  }
}
