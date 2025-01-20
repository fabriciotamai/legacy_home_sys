import { makeGenerateContractUseCase } from '@/use-cases/factories/admin/make-generate-contract-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

type AuthUser = {
  id: number;
  email: string;
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
  tokenVersion: number;
};

const schema = z.object({
  userId: z.number().min(1, 'ID do usuário inválido.'),
  enterpriseId: z.number().min(1, 'ID da empresa inválido.'),
  templateType: z.enum(['TYPE1', 'TYPE2', 'TYPE3']),
});

type GenerateContractRequest = FastifyRequest & { 
  user: AuthUser; 
  body: z.infer<typeof schema>; // 🔹 Tipando o corpo da requisição
};

export async function adminGenerateContractHandler(
  request: GenerateContractRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    console.log('📥 Recebendo requisição para gerar contrato...');

    // 🔸 Faz parse e valida os dados do body
    const { userId, enterpriseId, templateType } = schema.parse(request.body);

    // 🔹 Admin autenticado (vem do middleware `authMiddleware`)
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

    // 🔸 Instancia o caso de uso
    const generateContractUseCase = makeGenerateContractUseCase();

    console.log('⚙️ Iniciando geração do contrato...');

    // 🔹 Executa o caso de uso
    const {
      contractId,
      envelopeId,
      clientSigningUrl,
      adminSigningUrl,
    } = await generateContractUseCase.execute({
      userId,
      enterpriseId,
      templateType,
      adminId,
      adminEmail,
      adminName,
    });

    console.log('✅ Contrato gerado com sucesso!', {
      contractId,
      envelopeId,
      clientSigningUrl,
      adminSigningUrl,
    });

    // 🔹 Responde ao cliente com sucesso
    reply.status(200).send({
      message: 'Contrato gerado com sucesso!',
      contractId,
      envelopeId,
      clientSigningUrl,  // URL de assinatura do cliente
      adminSigningUrl,   // URL de assinatura do admin
    });
  } catch (error) {
    console.error('❌ Erro ao gerar contrato:', error);

    if (error instanceof z.ZodError) {
      console.error('⚠️ Erro de validação:', error.errors);
      return reply.status(400).send({ errors: error.errors });
    }

    if (error instanceof Error) {
      if (error.message.includes('DocuSign')) {
        console.error('⚠️ Erro ao chamar API do DocuSign:', error.message);
        return reply.status(502).send({ error: 'Falha na integração com DocuSign.' });
      }

      if (error.message.includes('prisma') || error.message.includes('database')) {
        console.error('⚠️ Erro ao acessar o banco de dados:', error.message);
        return reply.status(500).send({ error: 'Erro no banco de dados.' });
      }

      console.error('⚠️ Erro inesperado:', error.message);
      return reply.status(500).send({ error: error.message });
    }

    return reply.status(500).send({ error: 'Erro desconhecido.' });
  }
}
