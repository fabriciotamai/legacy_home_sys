import { prisma } from '@/lib/prisma';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { ApproveInvestmentService } from '@/services/approve-investment-service';
import { ContractInterest, InterestStatus } from '@prisma/client';

interface AcceptOrRejectInterestInput {
  interestId: string;
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export class AcceptOrRejectInterestUseCase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly usersRepository: UsersRepository,
    private readonly approveInvestmentService: ApproveInvestmentService,
  ) {}

  async execute(input: AcceptOrRejectInterestInput): Promise<ContractInterest> {
    const { interestId, status, reason } = input;

    return await prisma.$transaction(async (tx) => {
      
      const interest = await tx.contractInterest.findUnique({
        where: { interestId },
      });
      if (!interest) throw new Error('Interesse não encontrado.');

      
      const enterprise = await tx.enterprise.findUnique({
        where: { id: interest.enterpriseId },
      });
      if (!enterprise) throw new Error('Empreendimento não encontrado.');

      
      const user = await tx.user.findUnique({
        where: { id: interest.userId },
      });
      if (!user) throw new Error('Usuário não encontrado.');

      if (status === 'APPROVED') {
        
        await this.approveInvestmentService.approveInterest(
          user,
          enterprise,
          interestId,
          tx, 
        );
      }

      
      const updatedInterest = await tx.contractInterest.update({
        where: { interestId },
        data: { status },
      });

      
      await tx.interestLog.create({
        data: {
          userId: user.id,
          enterpriseId: enterprise.id,
          interestId,
          status: status as InterestStatus,
          reason: status === 'REJECTED' ? reason : undefined,
        },
      });

      return updatedInterest;
    });
  }
}
