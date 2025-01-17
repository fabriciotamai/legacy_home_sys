import { UsersRepository } from '@/repositories/user-repository';
import { ComplianceStatus } from '@prisma/client';

interface AcceptOrRejectComplianceInput {
  userId: number;
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

interface AcceptOrRejectComplianceOutput {
  message: string;
}

export class AcceptOrRejectComplianceUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: AcceptOrRejectComplianceInput): Promise<AcceptOrRejectComplianceOutput> {
    const { userId, status, reason } = input;
    
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (user.complianceStatus === ComplianceStatus.APPROVED) {
      throw new Error('O compliance do usuário já está aprovado.');
    }

    if (user.complianceStatus === ComplianceStatus.REJECTED && status === 'APPROVED') {
      throw new Error('Não é possível aprovar um compliance que foi rejeitado.');
    }

    if (status === 'REJECTED' && !reason) {
      throw new Error('O motivo é obrigatório para rejeições.');
    }

    await this.usersRepository.updateUser(userId, {
      complianceStatus: status,
      ...(status === 'REJECTED' && { rejectionReason: reason }),
    });

    return {
      message: `Compliance ${status === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso.`,
    };
  }
}
