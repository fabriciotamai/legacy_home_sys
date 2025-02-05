import { UsersRepository } from '@/repositories/user-repository';
import { WalletTransactionType } from '@prisma/client';

interface UpdateWalletBalanceInput {
  userId: number;
  amount: number;
  description?: string;
}

interface UpdateWalletBalanceOutput {
  newBalance: number;
}

export class UpdateWalletBalanceUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: UpdateWalletBalanceInput): Promise<UpdateWalletBalanceOutput> {
    const { userId, amount, description } = input;

    if (!amount) {
      throw new Error('O valor da transação deve ser diferente de zero.');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const currentBalance = user.walletBalance ?? 0;
    const newBalance = currentBalance + amount;

    if (newBalance < 0) {
      throw new Error('Saldo insuficiente para realizar esta operação.');
    }

    await this.usersRepository.updateUser(userId, {
      walletBalance: newBalance,
    });

    await this.usersRepository.addWalletTransaction({
      userId,
      type: amount > 0 ? WalletTransactionType.CREDIT : WalletTransactionType.DEBIT,
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: description || (amount > 0 ? 'Crédito manual' : 'Débito manual'),
    });

    return { newBalance };
  }
}
