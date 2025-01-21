

import { EnterpriseRepository } from '@/repositories/enterprise-repository';


export class GetUserEnterprisesUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute({ userId }: { userId: number }) {
    const enterprises = await this.enterpriseRepository.findByUserId(userId);

    
    return enterprises.map((enterprise) => {
      const { contracts, ...rest } = enterprise;
      const latestContract = contracts?.[0];

      
      const hasUserSignature = latestContract?.signatures.some(
        (sig) => sig.userId === userId && sig.signedAt !== null,
      );

      return {
        ...rest,
        interestStatus: enterprise.contractInterests[0]?.status ?? null,
        clientSigningUrl: latestContract?.clientSigningUrl ?? null,
        userHasSigned: !!hasUserSignature, 

      };
    });
  }
}