import { AdminRepository } from '@/repositories/admin-repository';

interface CreateEnterpriseInput {
  name: string;
  description: string;
  investmentType: 'MONEY' | 'PROPERTY'; 
  isAvailable: boolean; 
}

export class CreateEnterpriseUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(input: CreateEnterpriseInput): Promise<void> {
    const { name, description, investmentType, isAvailable } = input;

    
    if (!name || !description) {
      throw new Error('Nome e descrição são obrigatórios.');
    }

    if (!['MONEY', 'PROPERTY'].includes(investmentType)) {
      throw new Error('Tipo de investimento inválido.');
    }

    
    const existingEnterprise = await this.adminRepository.findEnterpriseByName(name);
    if (existingEnterprise) {
      throw new Error('Já existe um empreendimento com esse nome.');
    }

    
    await this.adminRepository.createEnterprise({
      name,
      description,
      investmentType,
      isAvailable,
      status: 'NEW', 
    });
  }
}
