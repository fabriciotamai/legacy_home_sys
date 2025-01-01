import { makeCreateDepositUseCase } from '@/use-cases/factories/users/make-user-deposit-use-case';
import { saveFile } from '@/utils/save-file';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function createDepositHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const createDepositSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'O valor do depósito deve ser maior que zero.',
    }),
    proofUrl: z.string().optional(),
  });

  try {
    if (!request.isMultipart()) {
      reply.status(400).send({ error: 'Formato da requisição inválido. Use multipart/form-data.' });
      return;
    }

    const userId = request.user?.id;

    if (!userId) {
      reply.status(401).send({ error: 'Usuário não autenticado.' });
      return;
    }

    const parts = request.parts();
    let amount: string | undefined;
    let proofUrl: string | undefined;

    for await (const part of parts) {
      if (part.type === 'field' && part.fieldname === 'amount') {
        amount = part.value as string;
      } else if (part.type === 'file' && part.fieldname === 'proof') {
        proofUrl = await saveFile(part);
      }
    }

    const validatedData = createDepositSchema.parse({ amount, proofUrl });

    const createDepositUseCase = makeCreateDepositUseCase();

    const result = await createDepositUseCase.execute({
      userId,
      amount: Number(validatedData.amount),
      proofUrl: validatedData.proofUrl || undefined,
    });

    reply.status(201).send({ message: result.message });
  } catch (error) {
    console.error('Erro ao criar depósito:', error);

    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Erro inesperado.',
      });
    }
  }
}
