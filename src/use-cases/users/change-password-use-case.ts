import { UsersRepository } from '@/repositories/user-repository';
import bcrypt from 'bcryptjs';

interface ChangePasswordInput {
  userId: number; 
  currentPassword: string; 
  newPassword: string; 
}

export class ChangePasswordUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const { userId, currentPassword, newPassword } = input;

    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error('A senha atual está incorreta.');
    }

    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    
    await this.userRepository.updatePassword(userId, hashedNewPassword);

    
    if (user.mustChangePassword) {
      await this.userRepository.updateUser(userId, { mustChangePassword: false });
    }
  }
}
