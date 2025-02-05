import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { ConstructionType, InvestmentType } from '@prisma/client';

interface CreateEnterpriseInput {
  name: string;
  corporateName: string;
  address: string;
  description: string;
  investmentType: InvestmentType;
  isAvailable: boolean;
  constructionType: ConstructionType;
  fundingAmount: number;
  transferAmount: number;
  postalCode: string;
  city: string;
  squareMeterValue: number;
  area: number;
  floors?: number;
  completionDate?: Date;
  coverImageUrl?: string;
  imageUrls?: string[];
}

interface CreateEnterpriseOutput {
  message: string;
  enterprise: {
    id: number;
    name: string;
    corporateName: string;
    address: string;
    description: string;
    status: string;
    isAvailable: boolean;
    investmentType: InvestmentType;
    constructionType: ConstructionType;
    fundingAmount: number;
    transferAmount: number;
    postalCode: string;
    city: string;
    squareMeterValue: number;
    area: number;
    progress: number;
    floors?: number | null;
    completionDate?: Date | null;
    coverImageUrl?: string | null;
    imageUrls: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export class CreateEnterpriseUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(input: CreateEnterpriseInput): Promise<CreateEnterpriseOutput> {
    const {
      name,
      corporateName,
      address,
      description,
      investmentType,
      isAvailable,
      constructionType,
      fundingAmount,
      transferAmount,
      postalCode,
      city,
      squareMeterValue,
      area,
      floors,
      completionDate,
      coverImageUrl,
      imageUrls = [],
    } = input;

    this.validateInput(input);

    if (imageUrls.length > 5) {
      throw new Error('No máximo 5 imagens podem ser anexadas na criação.');
    }

    const existingEnterprise = await this.enterpriseRepository.findByName(name);
    if (existingEnterprise) {
      throw new Error('Já existe um empreendimento com esse nome.');
    }

    const finalCoverImageUrl = coverImageUrl ?? imageUrls[0] ?? null;

    const enterprise = await this.enterpriseRepository.create({
      name,
      corporateName,
      address,
      description,
      investmentType,
      isAvailable,
      status: 'NEW',
      constructionType,
      fundingAmount,
      transferAmount,
      postalCode,
      city,
      squareMeterValue,
      area,
      floors: floors ?? null,
      completionDate: completionDate ?? null,
      coverImageUrl: finalCoverImageUrl,
    });

    if (!enterprise) {
      throw new Error('Erro ao criar o empreendimento.');
    }

    if (imageUrls.length > 0) {
      await this.enterpriseRepository.createMany(enterprise.id, imageUrls);
    }

    const storedImages = await this.enterpriseRepository.findByEnterpriseId(enterprise.id);

    return {
      message: 'Empreendimento criado com sucesso.',
      enterprise: {
        id: enterprise.id,
        name: enterprise.name,
        corporateName: enterprise.corporateName,
        address: enterprise.address,
        description: enterprise.description,
        status: enterprise.status,
        isAvailable: enterprise.isAvailable,
        investmentType: enterprise.investmentType,
        constructionType: enterprise.constructionType,
        fundingAmount: enterprise.fundingAmount,
        transferAmount: enterprise.transferAmount,
        postalCode: enterprise.postalCode,
        city: enterprise.city,
        squareMeterValue: enterprise.squareMeterValue,
        area: enterprise.area,
        progress: enterprise.progress,
        floors: enterprise.floors,
        completionDate: enterprise.completionDate,
        coverImageUrl: enterprise.coverImageUrl,
        imageUrls: storedImages,
        createdAt: enterprise.createdAt,
        updatedAt: enterprise.updatedAt,
      },
    };
  }

  private validateInput(input: CreateEnterpriseInput): void {
    const { name, description, fundingAmount, area, corporateName, address } = input;
    if (!name || !description || !corporateName || !address) {
      throw new Error('Nome, descrição, razão social e endereço são obrigatórios.');
    }
    if (fundingAmount <= 0 || area <= 0) {
      throw new Error('O valor de aporte e a metragem devem ser maiores que zero.');
    }
  }
}
