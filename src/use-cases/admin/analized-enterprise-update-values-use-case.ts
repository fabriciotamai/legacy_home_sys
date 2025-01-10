import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';

interface AnalyzeEnterpriseUpdateImpactInput {
  enterpriseId: number;
  newFundingAmount: number;
  newTransferAmount: number;
}

interface ImpactReport {
  userId: number;
  username: string;
  currentWalletBalance: number;
  currentTotalInvested: number;
  currentTotalValuation: number;
  impactOnWalletBalance: number;
  impactOnTotalInvested: number;
  impactOnTotalValuation: number;
}

interface AnalyzeEnterpriseUpdateImpactOutput {
  enterpriseId: number;
  enterpriseName: string;
  currentFundingAmount: number;
  currentTransferAmount: number;
  newFundingAmount: number;
  newTransferAmount: number;
  totalInvestors: number;
  impactDetails: ImpactReport[];
}

export class AnalyzeEnterpriseUpdateImpactUseCase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(input: AnalyzeEnterpriseUpdateImpactInput): Promise<AnalyzeEnterpriseUpdateImpactOutput> {
    const { enterpriseId, newFundingAmount, newTransferAmount } = input;

  
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) {
      throw new Error('Empreendimento não encontrado.');
    }

  
    const investments = await this.enterpriseRepository.findInvestmentsByEnterpriseId(enterpriseId);
    if (investments.length === 0) {
      return {
        enterpriseId,
        enterpriseName: enterprise.name,
        currentFundingAmount: enterprise.fundingAmount,
        currentTransferAmount: enterprise.transferAmount,
        newFundingAmount,
        newTransferAmount,
        totalInvestors: 0,
        impactDetails: [],
      };
    }
    const investorIds = investments.map(inv => inv.userId);
    const investors = await this.usersRepository.findUsersByIds(investorIds);

    
    const impactDetails: ImpactReport[] = [];

    for (const investor of investors) {
      const investment = investments.find(inv => inv.userId === investor.id);
      if (!investment) continue;

      const currentInvestedAmount = investment.investedAmount;
      const investedProportion = currentInvestedAmount / enterprise.fundingAmount;


      const impactOnTotalInvested = (newFundingAmount * investedProportion) - currentInvestedAmount;
      const impactOnTotalValuation = (newTransferAmount * investedProportion) - (enterprise.transferAmount * investedProportion);

  
      impactDetails.push({
        userId: investor.id,
        username: investor.username,
        currentWalletBalance: investor.walletBalance ?? 0,  
        currentTotalInvested: investor.totalInvested ?? 0,  
        currentTotalValuation: investor.totalValuation ?? 0,  
        impactOnWalletBalance: (investor.walletBalance ?? 0) - impactOnTotalInvested,
        impactOnTotalInvested: (investor.totalInvested ?? 0) + impactOnTotalInvested,
        impactOnTotalValuation: (investor.totalValuation ?? 0) + impactOnTotalValuation,
      });
    }

    return {
      enterpriseId,
      enterpriseName: enterprise.name,
      currentFundingAmount: enterprise.fundingAmount,
      currentTransferAmount: enterprise.transferAmount,
      newFundingAmount,
      newTransferAmount,
      totalInvestors: impactDetails.length,
      impactDetails,
    };
  }
}
