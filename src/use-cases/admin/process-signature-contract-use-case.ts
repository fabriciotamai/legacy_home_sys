import { ContractRepository } from '@/repositories/contract-repository';
import { Contract, ContractStatus, Role } from '@prisma/client';

interface ProcessContractSignatureInput {
  envelopeId: string;
  recipientId: string;
  status: string;
}

interface ProcessContractSignatureResponse {
  contract?: Contract;
  message: string;
}

export class ProcessContractSignatureUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute({
    envelopeId,
    recipientId,
    status,
  }: ProcessContractSignatureInput): Promise<ProcessContractSignatureResponse> {
    try {
      if (!envelopeId || !recipientId || !status) {
        return { message: '❌ Webhook inválido. Faltam dados obrigatórios.' };
      }

      console.log(`📩 Webhook recebido: envelopeId=${envelopeId}, recipientId=${recipientId}, status=${status}`);


      const contract = await this.contractRepository.findByEnvelopeId(envelopeId);
      if (!contract) {
        return { message: `❌ Contrato não encontrado para envelope ${envelopeId}.` };
      }

  
      let role: Role;
      if (recipientId === '1') {
        role = Role.USER;  
      } else if (recipientId === '2') {
        role = Role.ADMIN;
      } else {
        console.warn(`⚠️ Recipient ID desconhecido: ${recipientId}`);
        return { message: `⚠️ Recipient ID desconhecido: ${recipientId}` };
      }

    
      const signature = await this.contractRepository.findSignatureByContractAndRole(contract.id, role);
      if (!signature) {
        return { message: `❌ Assinatura não encontrada para role=${role} no contrato ${contract.id}.` };
      }


      if (signature.signedAt) {
        return { message: `⚠️ Assinatura já registrada anteriormente (role=${role}).` };
      }

      const now = new Date();

      
      await this.contractRepository.updateSignedAt(signature.id, now);

      
      await this.contractRepository.createSignatureLog(contract.id, signature.userId ?? null, role, now);

    
      const allSigned = await this.contractRepository.allSignaturesCompleted(contract.id);
      if (allSigned) {
        await this.contractRepository.updateStatus(contract.id, ContractStatus.SIGNED);
        console.log(`🎉 Contrato ${contract.id} está COMPLETAMENTE ASSINADO.`);
        return { contract, message: '🎉 Contrato finalizado com sucesso.' };
      }

      return {
        contract,
        message: `✅ Assinatura registrada (role=${role}), aguardando outras assinaturas.`,
      };

    } catch (error: unknown) {
      console.error('❌ Erro ao processar assinatura do contrato:', error);
      if (error instanceof Error) {
        return { message: `❌ Erro interno ao processar a assinatura: ${error.message}` };
      }
      return { message: '❌ Erro interno ao processar a assinatura.' };
    }
  }
}
