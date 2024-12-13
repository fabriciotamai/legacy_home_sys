import { AdminRepository } from '@/repositories/admin-repository';

interface ManageComplianceInput {
  userId: number;
  action: 'approve' | 'reject';
  reason?: string;
}

interface ManageComplianceOutput {
  userId: number;
  previousStatus: string;
  newStatus: string;
  reason?: string;
}

export class ManageComplianceUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(input: ManageComplianceInput): Promise<ManageComplianceOutput> {
    const { userId, action, reason } = input;

    
    const user = await this.adminRepository.findById(userId);
    if (!user) {
      throw new Error(`Usuário não encontrado. ID: ${userId}`);
    }

    
    this.validateAction(user, action, reason);

    
    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
    await this.adminRepository.updateUser(userId, {
      complianceStatus: newStatus,
      ...(action === 'reject' ? { rejectionReason: reason } : {}),
    });

    
  
    
    return {
      userId,
      previousStatus: user.complianceStatus,
      newStatus,
      reason: action === 'reject' ? reason : undefined,
    };
  }

  private validateAction(user: any, action: string, reason?: string): void {
    if (user.complianceStatus !== 'UNDER_REVIEW') {
      throw new Error(
        `Ação inválida. O status atual do compliance é ${user.complianceStatus}. Só é possível ${action} usuários em revisão.`
      );
    }

    if (action === 'reject' && !reason) {
      throw new Error('Motivo é obrigatório para rejeição.');
    }
  }
}
