import { DepositsRepository } from '@/repositories/deposit-repository';

interface GetAllDepositsInput {
  userId: number;
}

interface Deposit {
  id: number;
  amount: number;
  proofUrl?: string | null;
  status: string;
  createdAt: Date;
}

export class GetAllDepositsUseCase {
  constructor(private readonly depositsRepository: DepositsRepository) {}

  async execute(input: GetAllDepositsInput): Promise<Deposit[]> {
    const { userId } = input;

    return this.depositsRepository.findByUser(userId);
  }
}
