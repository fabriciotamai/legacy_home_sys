import { UsersRepository } from '@/repositories/user-repository';

interface GetDashboardDataUseCaseRequest {
  userId: number;
}

interface GetDashboardDataUseCaseResponse {
  pieChart: {
    casas: number;
    terrenos: number;
    walletBalance: number;
  };
  numeroEmpreendimentos: number;
  totalFundingAmount: number;
  totalTransferAmount: number;
}

export class GetDashboardDataUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: GetDashboardDataUseCaseRequest): Promise<GetDashboardDataUseCaseResponse> {
    const [casasCount, terrenosCount, walletBalance, contracts] = await Promise.all([
      this.usersRepository.countEnterprisesByType('CASA'),
      this.usersRepository.countEnterprisesByType('TERRENO'),
      this.usersRepository.getWalletBalance(userId),
      this.usersRepository.getSignedContractsWithEnterprise(userId),
    ]);

    const empreendimentoIds = new Set(contracts.map((c) => c.enterpriseId));
    const numeroEmpreendimentos = empreendimentoIds.size;

    const totalFundingAmount = contracts.reduce((acc, c) => acc + c.enterprise.fundingAmount, 0);
    const totalTransferAmount = contracts.reduce((acc, c) => acc + c.enterprise.transferAmount, 0);

    return {
      pieChart: {
        casas: casasCount,
        terrenos: terrenosCount,
        walletBalance,
      },
      numeroEmpreendimentos,
      totalFundingAmount,
      totalTransferAmount,
    };
  }
}
