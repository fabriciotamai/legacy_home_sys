import { makeProcessContractSignatureUseCase } from '@/use-cases/factories/admin/make-process-contract-signature-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function docusignWebhookHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    console.log('📩 Recebendo Webhook do Docusign:', req.body);

    
    const { envelopeId, signerEmail, status } = req.body as {
      envelopeId?: string;
      signerEmail?: string;
      status?: string;
    };

    if (!envelopeId || !signerEmail || !status) {
      console.warn('❌ Webhook recebido com dados inválidos:', req.body);
      return res.status(400).send({ message: '❌ Webhook inválido. Faltam dados obrigatórios.' });
    }

    // ✅ Chama o UseCase via Factory
    const processContractSignature = makeProcessContractSignatureUseCase();
    const result = await processContractSignature.execute({ envelopeId, signerEmail, status });

    console.log('✅ Webhook processado com sucesso:', result);

    return res.status(200).send(result);
  } catch (error) {
    console.error('❌ Erro ao processar Webhook do Docusign:', error);

    return res.status(500).send({
      message: '❌ Erro interno ao processar o Webhook.',
    });
  }
}
