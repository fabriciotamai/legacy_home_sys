import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { ContractInterest } from '@prisma/client';

interface InterestEnterpriseInput {
  userId: number;
  enterpriseId: number;
}

export class InterestEnterpriseUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly enterpriseRepository: EnterpriseRepository
  ) {}

  async execute(input: InterestEnterpriseInput): Promise<ContractInterest> {
    const { userId, enterpriseId } = input;

    
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) {
      throw new Error('Empreendimento não encontrado.');
    }

    
    const contractInterest = await this.enterpriseRepository.linkUserToEnterprise(
      userId,
      enterpriseId
    );

    return contractInterest;
  }
}
