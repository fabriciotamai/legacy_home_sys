import { UsersRepository } from '@/repositories/user-repository';
import { ConstructionType, Enterprise } from '@prisma/client';

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
  totalValution: number;
  totalInvested: number;
  recentEnterprises: Enterprise[];
  userRecentEnterprises: (Enterprise & { interestStatus?: string })[];
}

export class GetDashboardDataUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute({ userId }: GetDashboardDataUseCaseRequest): Promise<GetDashboardDataUseCaseResponse> {
    const [housesCount, landsCount, walletBalance, financials, approvedInterests, recentEnterprises, rawUserRecentEnterprises] =
      await Promise.all([
        this.usersRepository.countEnterprisesByType(userId, ConstructionType.HOUSE),
        this.usersRepository.countEnterprisesByType(userId, ConstructionType.LAND),
        this.usersRepository.getWalletBalance(userId),
        this.usersRepository.getUserFinancials(userId),
        this.usersRepository.getApprovedContractsWithEnterprise(userId),
        this.usersRepository.getRecentEnterprisesWithoutApprovedInterests(),
        this.usersRepository.getUserRecentEnterprises(userId),
      ]);

    const enterpriseIds = new Set(approvedInterests.map((interest) => interest.enterprise.id));
    const enterpriseCount = enterpriseIds.size;

    const userRecentEnterprises = rawUserRecentEnterprises.map((enterprise) => ({
      ...enterprise,
      interestStatus: enterprise.interestStatus ?? 'PENDING',
    }));

    return {
      pieChart: {
        houses: housesCount,
        lands: landsCount,
        walletBalance,
      },
      enterpriseCount,
      totalInvested: financials.totalInvested,
      totalValution: financials.totalValuation,
      recentEnterprises,
      userRecentEnterprises,
    };
  }
}
