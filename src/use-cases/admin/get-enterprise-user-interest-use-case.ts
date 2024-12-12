import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Enterprise } from '@prisma/client';

export class GetEnterprisesWithInterestsUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(): Promise<Enterprise[]> {
    return this.enterpriseRepository.findWithInterests();
  }
}