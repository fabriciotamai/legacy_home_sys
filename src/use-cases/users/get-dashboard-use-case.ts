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
  totalFundingAmount: number;
  totalTransferAmount: number;
  recentEnterprises: Enterprise[];
  userRecentEnterprises: (Enterprise & { interestStatus?: string })[];
}

export class GetDashboardDataUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: GetDashboardDataUseCaseRequest): Promise<GetDashboardDataUseCaseResponse> {
    const [housesCount, landsCount, walletBalance, approvedInterests, recentEnterprises, rawUserRecentEnterprises] =
      await Promise.all([
        this.usersRepository.countEnterprisesByType(userId, ConstructionType.HOUSE),
        this.usersRepository.countEnterprisesByType(userId, ConstructionType.LAND),
        this.usersRepository.getWalletBalance(userId),
        this.usersRepository.getApprovedContractsWithEnterprise(userId),
        this.usersRepository.getRecentEnterprisesWithoutApprovedInterests(), // Mantém os recentes sem interesses aprovados
        this.usersRepository.getUserRecentEnterprises(userId), // Método atualizado já filtra os 3 mais recentes
      ]);

    const enterpriseIds = new Set(approvedInterests.map((interest) => interest.enterprise.id));
    const enterpriseCount = enterpriseIds.size;

    const totalFundingAmount = approvedInterests.reduce((acc, interest) => acc + interest.enterprise.fundingAmount, 0);
    const totalTransferAmount = approvedInterests.reduce(
      (acc, interest) => acc + interest.enterprise.transferAmount,
      0,
    );

    // Processar os 3 empreendimentos mais recentes
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
      totalFundingAmount,
      totalTransferAmount,
      recentEnterprises,
      userRecentEnterprises,
    };
  }
}
