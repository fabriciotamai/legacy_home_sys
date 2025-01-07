import { makeUpdateUserAvatarUseCase } from '@/use-cases/factories/users/make-update-avatar-use-case';
import { saveFile } from '@/utils/save-file';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function updateUserAvatarHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const userId = request.user.id;
    const parts = request.parts();
    let avatarFile: string | undefined;

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'avatar') {
        avatarFile = await saveFile(part);
      }
    }

    if (!avatarFile) {
      return reply.status(400).send({ error: 'O arquivo do avatar é obrigatório.' });
    }

    const updateUserAvatarUseCase = makeUpdateUserAvatarUseCase();

    const response = await updateUserAvatarUseCase.execute({
      userId,
      avatarFile,
    });

    reply.status(200).send(response);
  } catch (error) {
    console.error('Erro inesperado no handler:', error);
    reply.status(500).send({ error: 'Erro inesperado.' });
  }
}
