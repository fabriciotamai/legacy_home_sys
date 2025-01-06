import { makeSendOrUpdateProofUseCase } from '@/use-cases/factories/users/make-send-or-update-proof-use-case';
import { saveFile } from '@/utils/save-file';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function sendOrUpdateProofHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const userId = request.user.id;
    const parts = request.parts();
    let depositId: number | undefined;
    let proofUrl: string | undefined;

    for await (const part of parts) {
      if (part.type === 'field' && part.fieldname === 'depositId') {
        depositId = Number(part.value);
      } else if (part.type === 'file' && part.fieldname === 'proof') {
        proofUrl = await saveFile(part);
      }
    }

    if (!depositId) {
      return reply.status(400).send({ error: 'O ID do depósito é obrigatório.' });
    }

    if (!proofUrl) {
      return reply.status(400).send({ error: 'O comprovante de pagamento é obrigatório.' });
    }

    const sendOrUpdateProofUseCase = makeSendOrUpdateProofUseCase();

    const response = await sendOrUpdateProofUseCase.execute({
      depositId,
      proofUrl,
      userId,
    });

    reply.status(200).send(response);
  } catch (error) {
    console.error('Erro inesperado no handler:', error);
    reply.status(500).send({ error: 'Erro inesperado.' });
  }
}
