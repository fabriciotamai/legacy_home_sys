import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Enterprise } from '@prisma/client';

interface GetUserEnterprisesInput {
  userId: number;
}

export class GetUserEnterprisesUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute({ userId }: GetUserEnterprisesInput): Promise<Enterprise[]> {
    if (!userId) {
      throw new Error('O ID do usuário é obrigatório.');
    }

    const enterprises = await this.enterpriseRepository.findByUserId(userId);

    return enterprises;
  }
}
