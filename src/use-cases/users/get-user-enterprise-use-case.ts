// src/use-cases/get-user-enterprises-use-case.ts

import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { EnterpriseWithContractInterests } from '@/types';

interface GetUserEnterprisesInput {
  userId: number;
}

export class GetUserEnterprisesUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute({ userId }: GetUserEnterprisesInput): Promise<EnterpriseWithContractInterests[]> {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.');
    }

    const enterprises = await this.enterpriseRepository.findByUserId(userId);


    const transformedEnterprises: EnterpriseWithContractInterests[] = enterprises.map((enterprise) => ({
      ...enterprise,
      interestStatus: enterprise.contractInterests[0]?.status, 
    }));

    return transformedEnterprises;
  }
}
