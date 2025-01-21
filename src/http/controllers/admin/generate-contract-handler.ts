import { makeGenerateContractUseCase } from '@/use-cases/factories/admin/make-generate-contract-use-case';
import { ContractTemplateType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const schema = z.object({
  userId: z.number().min(1, 'ID do usuário inválido.'),
  enterpriseId: z.number().min(1, 'ID da empresa inválido.'),
  templateType: z.nativeEnum(ContractTemplateType), // Usa o enum do Prisma
});

export async function adminGenerateContractHandler(
  request: FastifyRequest<{ Body: z.infer<typeof schema> }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { userId, enterpriseId, templateType } = schema.parse(request.body);

    const adminId = request.user.id;
    const adminEmail = request.user.email;
    const adminName = `${request.user.firstName} ${request.user.lastName}`;

    console.log('👀 Dados do Admin autenticado:', {
      adminId,
      adminEmail,
      adminName,
      userId,
      enterpriseId,
      templateType,
    });

    const generateContractUseCase = makeGenerateContractUseCase();

    const { contractId, envelopeId, clientSigningUrl, adminSigningUrl } =
      await generateContractUseCase.execute({
        userId,
        enterpriseId,
        templateType,
        adminId,
        adminEmail,
        adminName,
      });

    reply.status(200).send({
      message: 'Contrato gerado com sucesso!',
      contractId,
      envelopeId,
      clientSigningUrl,
      adminSigningUrl,
    });
  } catch (error) {
    console.error('❌ Erro ao gerar contrato:', error);

    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    reply.status(500).send({ error: 'Erro interno no servidor.' });
  }
}
