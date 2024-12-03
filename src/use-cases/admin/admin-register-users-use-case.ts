import { AdminRepository } from '@/repositories/admin-repository';

interface ManageComplianceInput {
  userId: number;
  action: 'approve' | 'reject';
  reason?: string; 
}

export class ManageComplianceUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(input: ManageComplianceInput): Promise<void> {
    const { userId, action, reason } = input;

    
    const user = await this.adminRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    
    if (action === 'approve' && user.complianceStatus !== 'UNDER_REVIEW') {
      throw new Error(
        `Ação inválida. O status atual do compliance é ${user.complianceStatus}. Só é possível aprovar usuários em revisão.`
      );
    }

    if (action === 'reject' && user.complianceStatus !== 'UNDER_REVIEW') {
      throw new Error(
        `Ação inválida. O status atual do compliance é ${user.complianceStatus}. Só é possível rejeitar usuários em revisão.`
      );
    }

    
    if (action === 'reject' && !reason) {
      throw new Error('Motivo é obrigatório para rejeição.');
    }

    
    await this.adminRepository.updateUser(userId, {
      complianceStatus: action === 'approve' ? 'APPROVED' : 'REJECTED',
      ...(action === 'reject' ? { rejectionReason: reason } : {}), 
    });
  }
}
