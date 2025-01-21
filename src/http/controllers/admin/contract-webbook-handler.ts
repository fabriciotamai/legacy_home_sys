import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeProcessContractSignatureUseCase } from '@/use-cases/factories/admin/make-process-contract-signature-use-case';

export async function docusignWebhookHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }


    const docusignWebhookSchema = z.object({
      event: z.string(),
      data: z.object({
        envelopeId: z.string(),
        status: z.string(),
      }),
    });

    // Faz o parse e valida o corpo do webhook
    const { event, data } = docusignWebhookSchema.parse(request.body);

    console.log('📩 Webhook recebido do DocuSign:', JSON.stringify(request.body, null, 2));
    console.log(`Evento recebido: ${event}`);
    console.log(`Envelope ID: ${data.envelopeId}`);
    console.log(`Status da assinatura: ${data.status}`);

  
    const userId = request.user.id;      
    const userEmail = request.user.email; 


    if (event === 'recipient-completed') {
   
      const processContractSignatureUseCase = makeProcessContractSignatureUseCase();

 
      const result = await processContractSignatureUseCase.execute({
        envelopeId: data.envelopeId,
        signerEmail: userEmail, 
        status: data.status,
      });

     
      if (result.contract) {
        console.log('Contrato atualizado com sucesso:', result.contract.id);
        return reply.status(200).send({
          message: result.message,
          contract: result.contract,
        });
      }

      return reply.status(200).send({ message: result.message });
    }

    console.log('⚠️ Evento não relevante para processamento. Ignorando.');
    return reply.status(200).send({ message: 'Evento ignorado.' });
    
  } catch (error) {
  
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      return reply.status(400).send({ errors: error.errors });
    }
    return reply
      .status(500)
      .send({ message: '❌ Erro interno ao processar o Webhook.' });
  }
}
