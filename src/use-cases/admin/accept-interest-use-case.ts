import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { ContractInterest } from '@prisma/client';

interface AcceptOrRejectInterestInput {
  interestId: string;
  status: 'APPROVED' | 'REJECTED';
}

export class AcceptOrRejectInterestUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: AcceptOrRejectInterestInput): Promise<ContractInterest> {
    const { interestId, status } = input;

    const interest = await this.enterpriseRepository.findInterestById(interestId);
    if (!interest) {
      throw new Error('Interesse não encontrado.');
    }

    const updatedInterest = await this.enterpriseRepository.updateInterestStatus(interestId, status);

    if (status === 'APPROVED') {
      await this.enterpriseRepository.removeOtherInterests(interest.enterpriseId, interestId);
    }

    return updatedInterest;
  }
}
