import { UsersRepository } from '@/repositories/user-repository';

interface SendDocumentsInput {
  userId: number;
  documentType: 'RG' | 'CNH' | 'PASSPORT';
  documentFront: string;
  documentBack?: string;
  proofOfAddress: string;
  incomeTaxProof: string;
}

export class SendDocumentsUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: SendDocumentsInput): Promise<void> {
    const {
      userId,
      documentType,
      documentFront,
      documentBack,
      proofOfAddress,
      incomeTaxProof,
    } = input;

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    await this.usersRepository.updateUser(userId, {
      documentType,
      documentFront,
      documentBack,
      proofOfAddress,
      incomeTaxProof,
      complianceStatus: 'UNDER_REVIEW',
    });
  }
}
