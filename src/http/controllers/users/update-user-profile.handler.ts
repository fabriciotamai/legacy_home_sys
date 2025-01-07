import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/users/make-update-profile-use-case';
import { UserType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function updateUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email('Email inválido.').optional(),
    numberDocument: z.string().optional(),
    userType: z.nativeEnum(UserType).optional(),
    birthDate: z.string().optional(),
    avatar: z.string().optional(),
  });

  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const parsedData = updateUserSchema.parse(request.body);
    const userId = request.user.id;

    const updateData = {
      ...parsedData,
      userId,
      userType: parsedData.userType as UserType | undefined,
      birthDate: parsedData.birthDate
        ? new Date(parsedData.birthDate)
        : undefined,
    };

    const updateUserProfileUseCase = makeUpdateUserProfileUseCase();
    await updateUserProfileUseCase.execute(updateData);

    reply.status(200).send({ message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    return reply.status(500).send({ error: 'Erro ao atualizar o perfil.' });
  }
}
