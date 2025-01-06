import { DepositsRepository } from '@/repositories/deposit-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { Decimal } from 'decimal.js';

interface CreateDepositInput {
  userId: number;
  amount: number;
  proofUrl?: string;
}

export class CreateDepositUseCase {
  constructor(
    private readonly depositsRepository: DepositsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: CreateDepositInput) {
    try {
      const { userId, amount, proofUrl } = input;

      const depositAmount = new Decimal(amount);
      if (depositAmount.lte(0)) {
        throw new Error('O valor do depósito deve ser maior que zero.');
      }

      const user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      const deposit = await this.depositsRepository.create({
        userId,
        amount: depositAmount.toNumber(),
        proofUrl: proofUrl || null,
      });

      return {
        message: proofUrl
          ? 'Depósito criado com comprovante enviado!'
          : 'Depósito criado com sucesso! Envie o comprovante quando estiver disponível.',
        deposit: {
          id: deposit.id,
          codeDeposit: deposit.codeDeposit,
          amount: deposit.amount,
          status: deposit.status,
          createdAt: deposit.createdAt,
        },
      };
    } catch (error) {
      console.error('Erro ao criar depósito:', error);
      throw new Error('Erro ao processar o depósito. Tente novamente mais tarde.');
    }
  }
}
