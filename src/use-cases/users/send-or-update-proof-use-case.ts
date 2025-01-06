import { PrismaDepositsRepository } from '@/repositories/prisma/prisma-deposit-repository';

interface SendOrUpdateProofInput {
  depositId: number;
  proofUrl: string;
  userId: number;
}

export class SendOrUpdateProofUseCase {
  constructor(private readonly depositsRepository: PrismaDepositsRepository) {}

  async execute(input: SendOrUpdateProofInput): Promise<{ message: string }> {
    try {
      const { depositId, proofUrl, userId } = input;

      const deposit = await this.depositsRepository.findById(depositId);
      if (!deposit) {
        throw new Error('Depósito não encontrado.');
      }

      if (deposit.userId !== userId) {
        throw new Error('Você não tem permissão para alterar este depósito.');
      }

      const updatedDeposit = await this.depositsRepository.updateProofUrl(depositId, proofUrl);

      return {
        message: updatedDeposit.proofUrl ? 'Comprovante atualizado com sucesso!' : 'Comprovante enviado com sucesso!',
      };
    } catch (error) {
      console.error('Erro ao enviar/atualizar comprovante:', error);
      throw new Error('Erro ao processar o envio do comprovante. Tente novamente mais tarde.');
    }
  }
}
