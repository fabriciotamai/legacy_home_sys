import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { ContractInterest } from '@prisma/client';

interface AcceptOrRejectInterestInput {
  interestId: string;
  status: 'APPROVED' | 'REJECTED';
}

export class AcceptOrRejectInterestUseCase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(input: AcceptOrRejectInterestInput): Promise<ContractInterest> {
    const { interestId, status } = input;

    const interest = await this.enterpriseRepository.findInterestById(interestId);
    if (!interest) {
      throw new Error('Interesse não encontrado.');
    }

    const enterprise = await this.enterpriseRepository.findById(interest.enterpriseId);
    if (!enterprise) {
      throw new Error('Empreendimento não encontrado.');
    }

    const user = await this.usersRepository.findById(interest.userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (status === 'APPROVED') {
      const userWalletBalance = user.walletBalance ?? 0;
      if (userWalletBalance < enterprise.fundingAmount) {
        throw new Error('Saldo insuficiente para aprovar o interesse.');
      }

      const updatedWalletBalance = userWalletBalance - enterprise.fundingAmount;

      await this.usersRepository.updateUserFinancials(
        user.id,
        updatedWalletBalance,
        enterprise.fundingAmount,
        enterprise.fundingAmount,
      );

      await this.enterpriseRepository.removeOtherInterests(enterprise.id, interestId);
    }

    const updatedInterest = await this.enterpriseRepository.updateInterestStatus(interestId, status);

    return updatedInterest;
  }
}
