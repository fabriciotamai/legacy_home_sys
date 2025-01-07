import { makeSendDocumentsUseCase } from '@/use-cases/factories/users/make-send-document-use-case';
import { saveFile } from '@/utils/save-file';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function sendDocumentsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const sendDocumentsSchema = z.object({
    documentType: z.enum(['RG', 'CNH', 'PASSPORT']),
  });

  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const parts = request.parts();
    const fields: Record<string, string> = {};
    let documentFront: string | undefined;
    let documentBack: string | undefined;
    let proofOfAddress: string | undefined;
    let incomeTaxProof: string | undefined;

    for await (const part of parts) {
      if (part.type === 'field') {
        if (typeof part.value === 'string') {
          fields[part.fieldname] = part.value;
        } else {
          throw new Error(`O campo ${part.fieldname} não é do tipo string.`);
        }
      } else if (part.fieldname === 'documentFront') {
        documentFront = await saveFile(part);
      } else if (part.fieldname === 'documentBack') {
        documentBack = await saveFile(part);
      } else if (part.fieldname === 'proofOfAddress') {
        proofOfAddress = await saveFile(part);
      } else if (part.fieldname === 'incomeTaxProof') {
        incomeTaxProof = await saveFile(part);
      }
    }

    const parsedFields = sendDocumentsSchema.parse(fields);

    if (!documentFront) {
      return reply
        .status(400)
        .send({ error: 'A imagem da frente do documento é obrigatória.' });
    }

    if (!proofOfAddress) {
      return reply
        .status(400)
        .send({ error: 'O comprovante de endereço é obrigatório.' });
    }

    if (!incomeTaxProof) {
      return reply
        .status(400)
        .send({ error: 'O comprovante de imposto de renda é obrigatório.' });
    }

    const userId = request.user.id;

    const sendDocumentsUseCase = makeSendDocumentsUseCase();

    await sendDocumentsUseCase.execute({
      userId,
      documentType: parsedFields.documentType,
      documentFront,
      documentBack,
      proofOfAddress,
      incomeTaxProof,
    });

    reply.status(200).send({ message: 'Documentos enviados com sucesso.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    console.error('Erro inesperado no handler:', error);
    reply.status(500).send({ error: 'Erro inesperado.' });
  }
}
