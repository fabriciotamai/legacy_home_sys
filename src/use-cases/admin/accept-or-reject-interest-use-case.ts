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

    const interest = await this.enterpriseRepository.findInterestById(interestId);
    if (!interest) throw new Error('Interesse não encontrado.');

    const enterprise = await this.enterpriseRepository.findById(interest.enterpriseId);
    if (!enterprise) throw new Error('Empreendimento não encontrado.');

    const user = await this.usersRepository.findById(interest.userId);
    if (!user) throw new Error('Usuário não encontrado.');

    if (status === 'APPROVED') {
      await this.approveInvestmentService.approveInterest(user, enterprise, interestId);
    }

    const updatedInterest = await this.enterpriseRepository.updateInterestStatus(interestId, status);

    await this.enterpriseRepository.addInterestLog({
      userId: user.id,
      enterpriseId: enterprise.id,
      interestId,
      status: status as InterestStatus,
      reason: status === 'REJECTED' ? reason : undefined,
    });

    return updatedInterest;
  }
}
