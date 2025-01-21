import { makeProcessContractSignatureUseCase } from '@/use-cases/factories/admin/make-process-contract-signature-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function docusignWebhookHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    console.log('📩 Webhook DocuSign Recebido - RAW BODY:', JSON.stringify(request.body, null, 2));

    const { event, data } = request.body as {
      event?: string;
      data?: {
        envelopeId?: string;
        recipientId?: string;
      };
    };

    if (!event || !data?.envelopeId || !data?.recipientId) {
      console.warn('⚠️ Webhook recebido sem `envelopeId` ou `recipientId`.');
      return reply.status(400).send({ message: 'Webhook inválido: envelopeId ou recipientId ausente.' });
    }

    console.log(`✅ Evento recebido: ${event}`);
    console.log(`📌 Envelope ID: ${data.envelopeId}`);
    console.log(`📌 Recipient ID: ${data.recipientId}`);

    if (event === 'recipient-completed') {
      console.log('🎉 Um destinatário assinou o contrato!');

      const processContractSignatureUseCase = makeProcessContractSignatureUseCase();

      const result = await processContractSignatureUseCase.execute({
        envelopeId: data.envelopeId,
        recipientId: data.recipientId, // Passamos apenas o recipientId para que o Use Case decida quem assinou
        status: 'completed',
      });

      if (result.contract) {
        console.log('Contrato atualizado com sucesso:', result.contract.id);
      }

      return reply.status(200).send({
        message: result.message,
        contract: result.contract,
      });
    }

    console.log(`⚠️ Evento ignorado: ${event}`);
    return reply.status(200).send({ message: `Evento ${event} ignorado.` });

  } catch (error) {
    console.error('❌ Erro inesperado no Webhook DocuSign:', error);
    return reply.status(500).send({ message: '❌ Erro interno ao processar o Webhook.' });
  }
}
