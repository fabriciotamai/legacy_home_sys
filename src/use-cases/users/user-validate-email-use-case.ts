import { UsersRepository } from '@/repositories/user-repository';
import { generateToken } from '@/utils/jwt';

interface ValidateEmailInput {
  userId: number;
  emailCode: string;
}

interface ValidateEmailOutput {
  token: string;
}

export class ValidateEmailUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(input: ValidateEmailInput): Promise<ValidateEmailOutput> {
    const { userId, emailCode } = input;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (user.emailConfirmationCode !== emailCode) {
      throw new Error('Código de e-mail inválido.');
    }

    if (
      !user.emailConfirmationExpires ||
      user.emailConfirmationExpires < new Date()
    ) {
      throw new Error('O código de e-mail expirou.');
    }

    const updatedUser = await this.userRepository.updateUser(userId, {
      emailConfirmationCode: null,
      emailConfirmationExpires: null,
      emailVerified: true,
      complianceStatus: 'PENDING_ADDRESS',
    });

    const token = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      tokenVersion: updatedUser.tokenVersion,
    });

    return { token };
  }
}
