import { DepositsRepository } from '@/repositories/deposit-repository';

interface CreateDepositInput {
  userId: number;
  amount: number;
  proofUrl?: string;
}

export class CreateDepositUseCase {
  constructor(private readonly depositsRepository: DepositsRepository) {}

  async execute(input: CreateDepositInput) {
    const { userId, amount, proofUrl } = input;

    if (amount <= 0) {
      throw new Error('O valor do depósito deve ser maior que zero.');
    }

    const deposit = await this.depositsRepository.create({
      userId,
      amount,
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
  }
}
