import { prisma } from '@/lib/prisma';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { ApproveInvestmentService } from '@/services/approve-investment-service';
import { ContractInterest, InterestStatus } from '@prisma/client';

interface BuyDirectInput {
  userId: number;
  enterpriseId: number;
}

export class BuyEnterpriseUseCase { 
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly usersRepository: UsersRepository,
    private readonly approveInvestmentService: ApproveInvestmentService,
  ) {}

  async execute(input: BuyDirectInput): Promise<ContractInterest> {
    const { userId, enterpriseId } = input;

    return await prisma.$transaction(async (tx) => {
   
      const user = await this.usersRepository.findById(userId, tx);
      if (!user) throw new Error('Usuário não encontrado.');

      
      const enterprise = await this.enterpriseRepository.findById(enterpriseId, tx);
      if (!enterprise) throw new Error('Empreendimento não encontrado.');

      
      const contractInterest =
        await this.enterpriseRepository.linkUserToEnterprise(
          userId,
          enterpriseId,
          InterestStatus.APPROVED,
          tx, 
        );

      
      await this.approveInvestmentService.approveInterest(
        user,
        enterprise,
        contractInterest.interestId,
        tx, 
      );

      
      await this.enterpriseRepository.addInterestLog({
        userId: user.id,
        enterpriseId: enterprise.id,
        interestId: contractInterest.interestId,
        status: InterestStatus.APPROVED,
      }, tx); 

      return contractInterest;
    });
  }
}
