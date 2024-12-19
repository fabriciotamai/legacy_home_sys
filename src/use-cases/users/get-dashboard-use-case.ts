import { UsersRepository } from '@/repositories/user-repository';
import { ConstructionType } from '@prisma/client';

interface GetDashboardDataUseCaseRequest {
  userId: number;
}

interface GetDashboardDataUseCaseResponse {
  pieChart: {
    houses: number;
    lands: number;
    walletBalance: number;
  };
  enterpriseCount: number;
  totalFundingAmount: number;
  totalTransferAmount: number;
}

export class GetDashboardDataUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: GetDashboardDataUseCaseRequest): Promise<GetDashboardDataUseCaseResponse> {
    const [housesCount, landsCount, walletBalance, contracts] = await Promise.all([
      this.usersRepository.countEnterprisesByType(ConstructionType.HOUSE),
      this.usersRepository.countEnterprisesByType(ConstructionType.LAND),
      this.usersRepository.getWalletBalance(userId),
      this.usersRepository.getSignedContractsWithEnterprise(userId),
    ]);

    const enterpriseIds = new Set(contracts.map((c) => c.enterpriseId));
    const enterpriseCount = enterpriseIds.size;

    const totalFundingAmount = contracts.reduce((acc, c) => acc + c.enterprise.fundingAmount, 0);
    const totalTransferAmount = contracts.reduce((acc, c) => acc + c.enterprise.transferAmount, 0);

    return {
      pieChart: {
        houses: housesCount,
        lands: landsCount,
        walletBalance,
      },
      enterpriseCount,
      totalFundingAmount,
      totalTransferAmount,
    };
  }
}
