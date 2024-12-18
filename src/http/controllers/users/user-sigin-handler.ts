import { makeUserSignin } from '@/use-cases/factories/users/make-signin-users-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function userSiginHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const loginSchema = z.object({
    email: z.string().email('E-mail inválido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  });

  try {
    const { email, password } = loginSchema.parse(request.body);

    const loginUseCase = makeUserSignin();
    const result = await loginUseCase.execute({ email, password });

    reply.status(200).send(result);
  } catch (error: any) {
    if (error.status && error.message) {
      reply.status(error.status).send({ message: error.message });
    } else {
      console.error('Erro inesperado:', error);
      reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }
}
