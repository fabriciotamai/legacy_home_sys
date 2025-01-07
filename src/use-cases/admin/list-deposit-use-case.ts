import { DepositsRepository } from '@/repositories/deposit-repository';
import { Deposit } from '@prisma/client';

export class ListDepositsUseCase {
  constructor(private readonly depositsRepository: DepositsRepository) {}

  async execute(
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_PROOF',
  ): Promise<{ deposits: Deposit[] }> {
    try {
      const deposits = await this.depositsRepository.findAll(status);

      return { deposits };
    } catch (error) {
      console.error(`Erro ao listar depósitos (${status || 'TODOS'}):`, error);
      throw new Error('Erro ao buscar depósitos. Tente novamente mais tarde.');
    }
  }
}
