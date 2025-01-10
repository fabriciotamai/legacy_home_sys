

import { EnterpriseRepository } from '@/repositories/enterprise-repository';

interface GetEnterpriseImageUrlsInput {
  enterpriseId: number;
  page?: number;
  limit?: number;
}

interface GetEnterpriseImageUrlsOutput {
  images: string[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetEnterpriseImageUrlsUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: GetEnterpriseImageUrlsInput): Promise<GetEnterpriseImageUrlsOutput> {
    const { enterpriseId, page = 1, limit = 10 } = input;

   
    this.validateInput(enterpriseId, page, limit);

   
    const images = await this.enterpriseRepository.findImageUrlsByEnterpriseId(
      enterpriseId,
      this.calculateSkip(page, limit),
      limit
    );


    const total = await this.enterpriseRepository.countImagesByEnterpriseId(enterpriseId);


    const totalPages = Math.ceil(total / limit);

    return {
      images,
      total,
      page,
      limit,
      totalPages,
    };
  }

 
  private validateInput(enterpriseId: number, page: number, limit: number): void {
    if (!Number.isInteger(enterpriseId) || enterpriseId <= 0) {
      throw new Error('O ID do empreendimento deve ser um número inteiro positivo.');
    }

    if (!Number.isInteger(page) || page < 1) {
      throw new Error('O número da página deve ser um número inteiro maior ou igual a 1.');
    }

    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error('O limite de imagens por página deve ser um número inteiro maior ou igual a 1.');
    }
  }


  private calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
