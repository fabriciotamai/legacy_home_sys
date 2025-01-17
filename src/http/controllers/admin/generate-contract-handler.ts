import { makeGenerateContractUseCase } from '@/use-cases/factories/admin/make-generate-contract-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminGenerateContractHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Validação da entrada com Zod
  const schema = z.object({
    userId: z.number().min(1, 'ID do usuário inválido.'),
    enterpriseId: z.number().min(1, 'ID da empresa inválido.'),
    templateType: z.enum(['TYPE1', 'TYPE2', 'TYPE3']),
  });

  try {
    
    const { userId, enterpriseId, templateType } = schema.parse(request.body);

    // Instancia o caso de uso
    const useCase = makeGenerateContractUseCase();

    // Executa o caso de uso
    const { contractId, envelopeId, signingUrl } = await useCase.execute({
      userId,
      enterpriseId,
      templateType,
    });

    // Retorna o contrato gerado
    reply.status(200).send({
      message: 'Contrato gerado com sucesso!',
      contractId,
      envelopeId,
      signingUrl,
    });
  } catch (error) {
    // Tratamento de erros
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      return reply.status(400).send({ errors: error.errors });
    }

    if (error instanceof Error) {
      console.error('Erro inesperado no handler:', error.message);
      return reply.status(500).send({ error: error.message });
    }

    return reply.status(500).send({ error: 'Erro desconhecido.' });
  }
}
