import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';

interface UpdateEnterpriseValuationInput {
  enterpriseId: number;
  newValuation: number;
  mode: 'consulting' | 'confirmed';
}

interface UpdateEnterpriseValuationOutput {
  enterprise: {
    valuationBefore: number;
    valuationAfter: number;
    difference: number;
    percentageChange: number;
  };
  user: {
    id: number;
    email: string;
    username: string;
    valuationBefore: number;
    valuationAfter: number;
    difference: number;
    percentageChange: number;
  };
}

export class UpdateEnterpriseValuationUseCase {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async execute(input: UpdateEnterpriseValuationInput): Promise<UpdateEnterpriseValuationOutput> {
    const { enterpriseId, newValuation, mode } = input;

    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) {
      throw new Error('Empreendimento não encontrado.');
    }

    const enterpriseValuationBefore = enterprise.transferAmount ?? 0;
    const difference = newValuation - enterpriseValuationBefore;
    const enterprisePercentageChange =
      enterpriseValuationBefore !== 0 ? (difference / enterpriseValuationBefore) * 100 : 100;

    const investment = await this.enterpriseRepository.findSingleInvestmentByEnterpriseId(enterpriseId);
    if (!investment) {
      throw new Error('Nenhum investimento encontrado para este empreendimento.');
    }

    const user = await this.usersRepository.findById(investment.userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const userValuationBefore = user.totalValuation ?? 0;
    const userValuationAfter = userValuationBefore + difference;
    const userValuationPercentageChange = userValuationBefore !== 0 ? (difference / userValuationBefore) * 100 : 100;

    if (mode === 'consulting') {
      return {
        enterprise: {
          valuationBefore: enterpriseValuationBefore,
          valuationAfter: newValuation,
          difference,
          percentageChange: enterprisePercentageChange,
        },
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          valuationBefore: userValuationBefore,
          valuationAfter: userValuationAfter,
          difference,
          percentageChange: userValuationPercentageChange,
        },
      };
    }

    await this.enterpriseRepository.update(enterpriseId, { transferAmount: newValuation });
    await this.usersRepository.updateUser(user.id, { totalValuation: userValuationAfter });

    return {
      enterprise: {
        valuationBefore: enterpriseValuationBefore,
        valuationAfter: newValuation,
        difference,
        percentageChange: enterprisePercentageChange,
      },
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        valuationBefore: userValuationBefore,
        valuationAfter: userValuationAfter,
        difference,
        percentageChange: userValuationPercentageChange,
      },
    };
  }
}
