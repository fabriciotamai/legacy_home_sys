import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/users/make-update-profile-use-case';
import { UserType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function updateUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    
    if (!request.user) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const userId = Number(request.user.id);

    
    const updateUserSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email('Email inválido.').optional(),
      numberDocument: z.string().optional(),
      userType: z.nativeEnum(UserType).optional(),
      birthDate: z.string().optional(),
    });

    const parsedData = updateUserSchema.parse(request.body);

    
    const updateData = {
      userId,
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      email: parsedData.email,
      numberDocument: parsedData.numberDocument,
      userType: parsedData.userType,
      birthDate: parsedData.birthDate ? new Date(parsedData.birthDate) : undefined,
    } as const;

    
    const updateUserProfileUseCase = makeUpdateUserProfileUseCase();
    const updatedUser = await updateUserProfileUseCase.execute(updateData);

    
    return reply.status(200).send({
      message: 'Perfil atualizado com sucesso.',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    console.error('Erro inesperado no updateUserHandler:', error);
    return reply.status(500).send({ error: 'Erro ao atualizar o perfil.' });
  }
}
