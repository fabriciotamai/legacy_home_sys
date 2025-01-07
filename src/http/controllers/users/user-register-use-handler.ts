import { makeUserRegisterUseCase } from '@/use-cases/factories/users/make-user-register-use-case';
import { UserType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function userRegisterHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userRegisterSchema = z.object({
    email: z.string().email('E-mail inválido.'),
    username: z
      .string()
      .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres.'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    firstName: z.string().min(1, 'O primeiro nome é obrigatório.'),
    lastName: z.string().min(1, 'O sobrenome é obrigatório.'),
    birthDate: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        { message: 'Data de nascimento inválida.' },
      ),
    userType: z.nativeEnum(UserType, {
      errorMap: () => ({ message: 'O tipo de usuário é inválido.' }),
    }),
    numberDocument: z.string().optional(),
    phone: z.string().optional(),
  });

  try {
    const validatedData = userRegisterSchema.parse(request.body);

    const userRegisterUseCase = makeUserRegisterUseCase();

    await userRegisterUseCase.execute({
      ...validatedData,
      birthDate: validatedData.birthDate
        ? new Date(validatedData.birthDate).toISOString()
        : undefined,
    });

    reply.status(201).send({ message: 'Usuário registrado com sucesso!' });
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
