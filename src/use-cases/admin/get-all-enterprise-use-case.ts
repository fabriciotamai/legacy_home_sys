import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Enterprise, EnterpriseStatus } from '@prisma/client';

interface GetAllEnterprisesInput {
  status?: EnterpriseStatus;
  investmentType?: 'MONEY' | 'PROPERTY';
  isAvailable?: boolean;
}

export class GetAllEnterprisesUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(filters: GetAllEnterprisesInput): Promise<Enterprise[]> {
    const { status, investmentType, isAvailable } = filters;

    const queryFilters = {
      status: status || undefined,
      investmentType: investmentType || undefined,
      isAvailable: isAvailable !== undefined ? isAvailable : undefined,
    };

    return this.enterpriseRepository.findAll(queryFilters);
  }
}
