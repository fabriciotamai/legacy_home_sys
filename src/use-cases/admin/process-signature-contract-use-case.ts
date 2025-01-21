import { ContractRepository } from '@/repositories/contract-repository';
import { Contract, ContractStatus } from '@prisma/client';

interface ProcessContractSignatureInput {
  envelopeId: string;
  signerEmail: string;
  status: string;
}

interface ProcessContractSignatureResponse {
  contract?: Contract;
  message: string;
}

export class ProcessContractSignatureUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  async execute({ envelopeId, signerEmail, status }: ProcessContractSignatureInput): Promise<ProcessContractSignatureResponse> {
    try {
      if (!envelopeId || !signerEmail || !status) {
        return { message: '❌ Webhook inválido. Faltam dados obrigatórios.' };
      }

      console.log(`📩 Webhook recebido: envelopeId=${envelopeId}, signerEmail=${signerEmail}, status=${status}`);

      // 🔍 Busca o contrato pelo envelopeId
      const contract = await this.contractRepository.findByEnvelopeId(envelopeId);
      if (!contract) {
        return { message: `❌ Contrato não encontrado para envelope ${envelopeId}.` };
      }

      console.log(`📄 Contrato ${contract.id} encontrado. Status atual: ${contract.status}`);

    
      const signature = await this.contractRepository.findSignatureByContractAndEmail(contract.id, signerEmail);
      if (!signature) {
        return { message: `❌ Assinatura não encontrada para email ${signerEmail}.` };
      }

      if (signature.signedAt) {
        return { message: `⚠️ Assinatura já registrada anteriormente para ${signerEmail}.` };
      }

      const now = new Date();

      // ✅ Atualiza a assinatura na tabela `ContractSignature`
      await this.contractRepository.updateSignedAt(signature.id, now);

      // ✅ Cria um log na `ContractSignatureLog`
      await this.contractRepository.createSignatureLog(contract.id, signature.userId, signature.role, now);

      console.log(`✅ ${signerEmail} assinou o contrato ${contract.id} como ${signature.role}`);

      // ✅ Verifica se todas as assinaturas foram concluídas
      const allSigned = await this.contractRepository.allSignaturesCompleted(contract.id);
      if (allSigned) {
        await this.contractRepository.updateStatus(contract.id, ContractStatus.SIGNED);
        console.log(`🎉 Contrato ${contract.id} está COMPLETAMENTE ASSINADO.`);
        return { contract, message: '🎉 Contrato finalizado com sucesso.' };
      }

      return { contract, message: `✅ Assinatura registrada para ${signerEmail}, aguardando outras assinaturas.` };

    } catch (error: unknown) {
      console.error('❌ Erro ao processar assinatura do contrato:', error);
    
      if (error instanceof Error) {
        return { message: `❌ Erro interno ao processar a assinatura: ${error.message}` };
      }
    
      return { message: '❌ Erro interno ao processar a assinatura.' };
    }
  }
}

