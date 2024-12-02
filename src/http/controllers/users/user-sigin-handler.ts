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
  } catch (error) {
    if (error instanceof z.ZodError) {
      
      reply.status(400).send({ errors: error.errors });
    } else if (error instanceof Error) {
      
      reply.status(401).send({ error: error.message });
    } else {
      
      reply.status(500).send({ error: 'Erro desconhecido.' });
    }
  }
}
