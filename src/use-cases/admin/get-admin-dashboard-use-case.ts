import { AdminRepository } from '@/repositories/admin-repository';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';

interface GetAdminDashboardDataResponse {
  totalUsers: number;
  totalInvested: number;
  totalValuation: number;
  linkedEnterprisesCount: number;
  unlinkedEnterprisesCount: number;
}

export class GetAdminDashboardDataUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
  ) {}

  async execute(): Promise<GetAdminDashboardDataResponse> {
    const [users, enterprises] = await Promise.all([this.adminRepository.findAllUsers(), this.enterpriseRepository.findAll({})]);

    const totalUsers = users.length;

    let totalInvested = 0;
    let totalValuation = 0;

    for (const user of users) {
      totalInvested += user.totalInvested ?? 0;
      totalValuation += user.totalValuation ?? 0;
    }

    const linkedEnterprisesCount = enterprises.filter((enterprise) => enterprise.investments && enterprise.investments.length > 0).length;

    const unlinkedEnterprisesCount = enterprises.length - linkedEnterprisesCount;

    return {
      totalUsers,
      totalInvested,
      totalValuation,
      linkedEnterprisesCount,
      unlinkedEnterprisesCount,
    };
  }
}
