import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { Enterprise, User, WalletTransactionType } from '@prisma/client';

export class ApproveInvestmentService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
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

  async approveInterest(user: User, enterprise: Enterprise, interestId: string): Promise<void> {
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
}
