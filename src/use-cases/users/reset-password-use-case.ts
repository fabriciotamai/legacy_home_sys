import { UsersRepository } from '@/repositories/user-repository';
import bcrypt from 'bcryptjs';

interface ResetPasswordInput {
  email: string;
  code: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const { email, code, newPassword } = input;

    
    const isValid = await this.userRepository.verifyPasswordResetCode(email, code);
    if (!isValid) {
      throw new Error('Código inválido ou expirado.');
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await this.userRepository.resetPassword(email, hashedPassword);
  }
}
