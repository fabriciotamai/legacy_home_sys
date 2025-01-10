import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { Enterprise, Prisma } from '@prisma/client';
import { AnalyzeEnterpriseUpdateImpactUseCase } from './analized-enterprise-update-values-use-case';

interface UpdateEnterpriseInput {
  enterpriseId: number;
  data: Prisma.EnterpriseUpdateInput; 
  forceUpdate?: boolean;
}

interface UpdateEnterpriseResponse {
  enterprise?: Enterprise;
  impactReport?: object;
  message?: string;
}

export class UpdateEnterpriseUseCase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly analyzeImpactUseCase: AnalyzeEnterpriseUpdateImpactUseCase
  ) {}

  async execute({ enterpriseId, data, forceUpdate = false }: UpdateEnterpriseInput): Promise<UpdateEnterpriseResponse> {
    
    const validData = { ...data };
    delete (validData as any).forceUpdate; 

    
    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) {
      throw new Error('Empreendimento não encontrado.');
    }
    
    const newFundingAmount = typeof validData.fundingAmount === 'number' ? validData.fundingAmount : enterprise.fundingAmount;
    const newTransferAmount = typeof validData.transferAmount === 'number' ? validData.transferAmount : enterprise.transferAmount;

   
    const isFundingAmountChanging = newFundingAmount !== enterprise.fundingAmount;
    const isTransferAmountChanging = newTransferAmount !== enterprise.transferAmount;

 
    if (!isFundingAmountChanging && !isTransferAmountChanging) {
      const updatedEnterprise = await this.enterpriseRepository.update(enterpriseId, validData);
      return { enterprise: updatedEnterprise, message: 'Empreendimento atualizado sem impactos.' };
    }


    const investments = await this.enterpriseRepository.findInvestmentsByEnterpriseId(enterpriseId);
    
    if (investments.length === 0) {
      console.log('⚡️ Sem investidores, atualização segura.');
      const updatedEnterprise = await this.enterpriseRepository.update(enterpriseId, validData);
      return { enterprise: updatedEnterprise, message: 'Empreendimento atualizado. Nenhum investidor impactado.' };
    }

 
    if (!forceUpdate) {
      console.log('🚨 Mudanças detectadas e investidores envolvidos. Gerando relatório...');
      const impactReport = await this.analyzeImpactUseCase.execute({
        enterpriseId,
        newFundingAmount,
        newTransferAmount,
      });

      return {
        message: '⚠️ Atualização bloqueada devido ao impacto nos investidores.',
        impactReport,
      };
    }

    const updatedEnterprise = await this.enterpriseRepository.update(enterpriseId, validData);
    return { enterprise: updatedEnterprise, message: '✅ Empreendimento atualizado com forceUpdate.' };
  }
}
