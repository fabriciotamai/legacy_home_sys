import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { EnterpriseStatus, InterestStatus, Prisma } from '@prisma/client';

interface GetAllEnterprisesInput {
  status?: EnterpriseStatus;
  investmentType?: 'MONEY' | 'PROPERTY';
  isAvailable?: boolean;
}

type EnterpriseWithContractInterests = Prisma.EnterpriseGetPayload<{
  include: { contractInterests: true };
}>;

export class GetEnterprisesAvailableUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(filters: GetAllEnterprisesInput): Promise<EnterpriseWithContractInterests[]> {
    const enterprises = await this.enterpriseRepository.findAll(filters);

    const filteredEnterprises = enterprises.filter((enterprise) => {
      return !enterprise.contractInterests?.some((interest) => interest.status === InterestStatus.APPROVED);
    });

    return filteredEnterprises;
  }
}
