import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { ContractInterest, Enterprise, InterestStatus, User, WalletTransactionType } from '@prisma/client';

interface AcceptOrRejectInterestInput {
  interestId: string;
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export class AcceptOrRejectInterestUseCase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  private calculateFinancialUpdate(user: User, enterprise: Enterprise) {
    const userWalletBalance = user.walletBalance ?? 0;
    if (userWalletBalance < enterprise.fundingAmount) {
      throw new Error('Saldo insuficiente para aprovar o interesse.');
    }

    return {
      updatedWalletBalance: userWalletBalance - enterprise.fundingAmount,
      updatedTotalInvested: (user.totalInvested ?? 0) + enterprise.fundingAmount,
      updatedTotalValuation: (user.totalValuation ?? 0) + enterprise.transferAmount,
    };
  }

  private async approveInterest(user: User, enterprise: Enterprise, interestId: string): Promise<void> {
    const { updatedWalletBalance, updatedTotalInvested, updatedTotalValuation } = this.calculateFinancialUpdate(
      user,
      enterprise,
    );

    await this.usersRepository.updateUserFinancials(
      user.id,
      updatedWalletBalance,
      updatedTotalInvested,
      updatedTotalValuation,
    );

    await this.usersRepository.addWalletTransaction({
      userId: user.id,
      type: WalletTransactionType.DEBIT,
      amount: enterprise.fundingAmount,
      balanceBefore: user.walletBalance ?? 0,
      balanceAfter: updatedWalletBalance,
      description: `Investimento aprovado para o empreendimento "${enterprise.name}".`,
    });

    await this.enterpriseRepository.addInvestment({
      userId: user.id,
      enterpriseId: enterprise.id,
      investedAmount: enterprise.fundingAmount,
    });

    await this.enterpriseRepository.removeOtherInterests(enterprise.id, interestId);
  }

  async execute(input: AcceptOrRejectInterestInput): Promise<ContractInterest> {
    const { interestId, status, reason } = input;

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
      await this.approveInterest(user, enterprise, interestId);
    }

    const updatedInterest = await this.enterpriseRepository.updateInterestStatus(interestId, status);

    await this.enterpriseRepository.addInterestLog({
      userId: user.id,
      enterpriseId: enterprise.id,
      interestId,
      status: status as InterestStatus,
      reason: status === 'REJECTED' ? reason : undefined,
    });

    return updatedInterest;
  }
}
