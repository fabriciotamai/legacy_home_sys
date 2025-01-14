import { PrismaContractRepository } from '@/repositories/prisma/prisma-contract-repository';
import { ContractTemplateType } from '@prisma/client';

interface UploadContractTemplateInput {
  templateType: ContractTemplateType;
  filePath: string; 
  fileMimeType: string;
  adminId: number;
}

interface UploadContractTemplateOutput {
  id: string;
  templateType: ContractTemplateType;
  filePath: string;
}

export class UploadContractTemplateUseCase {
  constructor(private readonly contractRepository: PrismaContractRepository) {}

  async execute({ templateType, filePath, fileMimeType, adminId }: UploadContractTemplateInput): Promise<UploadContractTemplateOutput> {
    try {
  
      const contractTemplate = await this.contractRepository.createTemplate({
        name: `Template ${templateType}`,
        type: templateType,
        filePath, 
        fileMimeType,
        admin: { connect: { id: adminId } },
      
      });

      console.log('✅ Template criado com sucesso:', contractTemplate.id);

      return {
        id: contractTemplate.id,
        templateType: contractTemplate.type,
        filePath: contractTemplate.filePath!,
      };
    } catch (error) {
      console.error('❌ Erro ao salvar o contrato:', error);
      throw new Error('Falha ao salvar o template. Tente novamente.');
    }
  }
}
