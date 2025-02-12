import { AdminRepository } from '@/repositories/admin-repository';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { ContractInterest, InterestStatus } from '@prisma/client';

interface LinkUserToEnterpriseInput {
  userId: number;
  enterpriseId: number;
  status?: InterestStatus;  
}

export class LinkUserToEnterpriseUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
  ) {}

  async execute(input: LinkUserToEnterpriseInput): Promise<ContractInterest> {
    const { userId, enterpriseId, status = InterestStatus.PENDING } = input; 
    const user = await this.adminRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) {
      throw new Error('Empreendimento não encontrado.');
    }

    const contractInterest =
      await this.enterpriseRepository.linkUserToEnterprise(
        userId,
        enterpriseId,
        status,  
      );

    return contractInterest;
  }
}
