import { UsersRepository } from '@/repositories/user-repository';
import { ConstructionType, Enterprise } from '@prisma/client';

interface GetDashboardDataUseCaseRequest {
  userId: number;
}

interface GetDashboardWebDataUseCaseResponse {
  pieChart: {
    houses: number;
    lands: number;
    walletBalance: number;
  };
  enterpriseCount: number;
  totalValuation: number;
  totalInvested: number;
  recentEnterprises: Enterprise[];
  userEnterprises: Enterprise[];
}

export class GetDashboardWebDataUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetDashboardDataUseCaseRequest): Promise<GetDashboardWebDataUseCaseResponse> {
    
    const [
      housesCount,
      landsCount,
      walletBalance,
      financials,
      approvedInterests,
      allRecentEnterprises,
      allUserEnterprises,
    ] = await Promise.all([
      this.usersRepository.countEnterprisesByType(userId, ConstructionType.HOUSE),
      this.usersRepository.countEnterprisesByType(userId, ConstructionType.LAND),
      this.usersRepository.getWalletBalance(userId),
      this.usersRepository.getUserFinancials(userId),
      this.usersRepository.getApprovedContractsWithEnterprise(userId),
      this.usersRepository.getAllRecentEnterprises(), 
      this.usersRepository.getAllUserEnterprises(userId),
    ]);

    const enterpriseIds = new Set(approvedInterests.map(interest => interest.enterprise.id));
    const enterpriseCount = enterpriseIds.size + allUserEnterprises.length;

    return {
      pieChart: {
        houses: housesCount ?? 0,
        lands: landsCount ?? 0,
        walletBalance: walletBalance ?? 0,
      },
      enterpriseCount,
      totalInvested: financials.totalInvested ?? 0,
      totalValuation: financials.totalValuation ?? 0,
      recentEnterprises: allRecentEnterprises,
      userEnterprises: allUserEnterprises,
    };
  }
}
