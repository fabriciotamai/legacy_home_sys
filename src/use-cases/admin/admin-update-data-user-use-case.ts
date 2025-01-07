import { UsersRepository } from '@/repositories/user-repository';
import { ComplianceStatus, DocumentType, Role } from '@prisma/client';

interface UpdateUserInput {
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  userType?: 'INDIVIDUAL' | 'BUSINESS';
  isActive?: boolean;
  complianceStatus?: ComplianceStatus;
  role?: Role;
  documentType?: DocumentType;
  numberDocument?: string;
}

export class AdminUpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: UpdateUserInput): Promise<void> {
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      userType,
      isActive,
      complianceStatus,
      role,
      documentType,
      numberDocument,
    } = input;

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    await this.usersRepository.updateUser(userId, {
      firstName,
      lastName,
      email,
      phone,
      userType,
      isActive,
      complianceStatus,
      role,
      documentType,
      numberDocument,
    });
  }
}
