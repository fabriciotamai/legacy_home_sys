import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';

/**
 * Estrutura de entrada do Use Case
 */
interface UpdateEnterpriseValuationInput {
  enterpriseId: number;
  newValuation: number;
  mode: 'consulting' | 'confirmed';
}

/**
 * Estrutura de saída (retorno) do Use Case
 */
interface UpdateEnterpriseValuationOutput {
  enterpriseValuationBefore: number;
  enterpriseValuationAfter: number;
  difference: number;
  enterprisePercentageChange: number;
  userId: number;
  userValuationBefore: number;
  userValuationAfter: number;
  userValuationDifference: number;
  userValuationPercentageChange: number;
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
      enterpriseValuationBefore !== 0
        ? (difference / enterpriseValuationBefore) * 100
        : difference > 0
          ? 100
          : difference < 0
            ? -100
            : 0;

    const investment = await this.enterpriseRepository.findSingleInvestmentByEnterpriseId(enterpriseId);
    if (!investment) {
      throw new Error('Nenhum investimento encontrado para este empreendimento.');
    }

    const user = await this.usersRepository.findById(investment.userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const userValuationBefore = user.totalValuation ?? 0;
    const userValuationDifference = difference;
    const userValuationAfter = userValuationBefore + userValuationDifference;

    const userValuationPercentageChange =
      userValuationBefore !== 0
        ? (userValuationDifference / userValuationBefore) * 100
        : userValuationDifference > 0
          ? 100
          : userValuationDifference < 0
            ? -100
            : 0;

    if (mode === 'consulting') {
      return {
        enterpriseValuationBefore,
        enterpriseValuationAfter: newValuation,
        difference,
        enterprisePercentageChange,
        userId: user.id,
        userValuationBefore,
        userValuationAfter,
        userValuationDifference,
        userValuationPercentageChange,
      };
    }

    await this.enterpriseRepository.update(enterpriseId, {
      transferAmount: newValuation,
    });

    await this.usersRepository.updateUser(user.id, {
      totalValuation: userValuationAfter,
    });

    return {
      enterpriseValuationBefore,
      enterpriseValuationAfter: newValuation,
      difference,
      enterprisePercentageChange,
      userId: user.id,
      userValuationBefore,
      userValuationAfter,
      userValuationDifference,
      userValuationPercentageChange,
    };
  }
}
