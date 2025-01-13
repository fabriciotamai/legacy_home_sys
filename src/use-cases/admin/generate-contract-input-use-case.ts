import { ContractRepository } from '@/repositories/contract-repository';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';


import { getDocusignAccessToken } from '@/services/docusign/docu-sigin-auth';
import { createEnvelopeOnDocusign } from '@/services/docusign/docu-sigin-envelope';
import { getEmbeddedSigningUrl } from '@/services/docusign/docu-signin-signin';

import { ContractStatus, ContractTemplateType } from '@prisma/client';

interface GenerateContractInput {
  userId: number;
  enterpriseId: number;
  templateType: ContractTemplateType;
}

interface GenerateContractOutput {
  contractId: string;
  envelopeId?: string;
  signingUrl?: string;
}

export class GenerateContractUseCase {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
  ) {}

  async execute({ userId, enterpriseId, templateType }: GenerateContractInput): Promise<GenerateContractOutput> {

    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) {
      throw new Error(`Enterprise ${enterpriseId} não existe`);
    }


    const contract = await this.contractRepository.create({
      type: 'MONEY', 
      templateType,
      user: { connect: { id: userId } },
      enterprise: { connect: { id: enterpriseId } },
      status: ContractStatus.PENDING,
    });


    const accessToken = await getDocusignAccessToken();

    const envelopeId = await createEnvelopeOnDocusign({
      userId,
      enterprise,
      contract,
    });

  
    await this.contractRepository.setEnvelopeId(contract.id, envelopeId);

  
    const signingUrl = await getEmbeddedSigningUrl({
      envelopeId,
      userId,
      userName: 'Fulano da Silva', 
      userEmail: 'fulano@email.com', 
    });

    return {
      contractId: contract.id,
      envelopeId,
      signingUrl,
    };
  }
}
