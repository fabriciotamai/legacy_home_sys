import { EnterpriseRepository } from '@/repositories/enterprise-repository';

interface GetEnterpriseImageUrlsInput {
  enterpriseId: number;
  page?: number;
  limit?: number;
}

interface ImageObject {
  id: number;
  url: string;
}

interface GetEnterpriseImageUrlsOutput {
  images: ImageObject[];
  coverImageUrl: string | null; 
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

    
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    const coverImageUrl = enterprise.coverImageUrl; 

  
    const imageUrls = await this.enterpriseRepository.findImageUrlsByEnterpriseId(
      enterpriseId,
      this.calculateSkip(page, limit),
      limit
    );

    const total = await this.enterpriseRepository.countImagesByEnterpriseId(enterpriseId);

    const totalPages = Math.ceil(total / limit);

    
    let images: ImageObject[] = imageUrls.map((url, index) => ({
      id: this.calculateSkip(page, limit) + index + 2,
      url,
    }));

   
    if (coverImageUrl) {
      images = [{ id: 1, url: coverImageUrl }, ...images];
    }

    return {
      images,
      coverImageUrl, 
      total: total + (coverImageUrl ? 1 : 0), 
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
