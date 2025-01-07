import { DepositsRepository } from '@/repositories/deposit-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { Deposit, WalletTransactionType } from '@prisma/client';
import { Decimal } from 'decimal.js';

interface ApproveOrRejectDepositInput {
  depositId: number;
  status: 'APPROVED' | 'REJECTED';
  adminComment?: string;
}

export class ApproveOrRejectDepositUseCase {
  constructor(
    private readonly depositsRepository: DepositsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    input: ApproveOrRejectDepositInput,
  ): Promise<{ deposit: Deposit }> {
    try {
      const { depositId, status, adminComment } = input;

      const deposit = await this.depositsRepository.findById(depositId);
      if (!deposit) {
        throw new Error('Depósito não encontrado.');
      }

      if (deposit.status === 'APPROVED' || deposit.status === 'REJECTED') {
        throw new Error('Depósito já foi processado.');
      }

      let updatedDeposit = await this.depositsRepository.updateStatus(
        depositId,
        status,
        adminComment,
      );

      if (status === 'APPROVED') {
        const user = await this.usersRepository.findById(deposit.userId);
        if (!user) throw new Error('Usuário não encontrado.');

        const depositAmount = new Decimal(deposit.amount);
        const newBalance = new Decimal(user.walletBalance || 0).plus(
          depositAmount,
        );

        await this.usersRepository.updateWalletBalance(
          deposit.userId,
          newBalance.toNumber(),
        );

        await this.usersRepository.addWalletTransaction({
          userId: deposit.userId,
          type: WalletTransactionType.CREDIT,
          amount: depositAmount.toNumber(),
          balanceBefore: user.walletBalance || 0,
          balanceAfter: newBalance.toNumber(),
          description: `Depósito aprovado - ID: ${deposit.id}`,
        });

        updatedDeposit =
          await this.depositsRepository.updateBalanceUpdatedAt(depositId);
      }

      return { deposit: updatedDeposit };
    } catch (error) {
      console.error('Erro ao processar depósito:', error);
      throw new Error(
        'Erro ao aprovar/rejeitar depósito. Tente novamente mais tarde.',
      );
    }
  }
}
