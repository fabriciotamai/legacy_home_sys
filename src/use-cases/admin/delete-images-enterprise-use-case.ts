import { EnterpriseRepository } from '@/repositories/enterprise-repository';

interface DeleteEnterpriseImagesInput {
  enterpriseId: number;
  imageUrls: string[];
}

export class DeleteEnterpriseImagesUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute({ enterpriseId, imageUrls }: DeleteEnterpriseImagesInput): Promise<{ message: string }> {
    if (imageUrls.length === 0) {
      throw new Error('Nenhuma imagem foi enviada para exclusão.');
    }

   
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) {
      throw new Error('Empreendimento não encontrado.');
    }


    await this.enterpriseRepository.deleteImagesByEnterprise(enterpriseId, imageUrls);

    return { message: 'Imagens removidas com sucesso.' };
  }
}
