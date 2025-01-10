// src/use-cases/enterprise/DeleteEnterpriseUseCase.ts

import { EnterpriseRepository } from '@/repositories/enterprise-repository';

interface DeleteEnterpriseInput {
  enterpriseId: number;
}

export class DeleteEnterpriseUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: DeleteEnterpriseInput): Promise<void> {
    const { enterpriseId } = input;

    if (!Number.isInteger(enterpriseId) || enterpriseId <= 0) {
      throw new Error('O ID do empreendimento deve ser um número inteiro positivo.');
    }

    await this.enterpriseRepository.deleteEnterprise(enterpriseId);
  }
}
