import { EnterpriseRepository } from '@/repositories/enterprise-repository';

export class GetPhasesUseCase {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async execute(): Promise<any> {
    const phases = await this.enterpriseRepository.findAllPhasesWithTasks();

    if (!phases || phases.length === 0) {
      throw new Error('Nenhuma fase encontrada.');
    }

    return phases;
  }
}
