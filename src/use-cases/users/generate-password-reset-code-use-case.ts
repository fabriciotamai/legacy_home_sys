import { UsersRepository } from '@/repositories/user-repository';
import { sendEmailWithTemplate } from '@/services/email-service';

interface GeneratePasswordResetCodeInput {
  email: string;
}

export class GeneratePasswordResetCodeUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(input: GeneratePasswordResetCodeInput): Promise<void> {
    const { email } = input;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.userRepository.updatePasswordResetCode(email, resetCode, expiresAt);

    const emailData = {
      name: user.username,
      code: resetCode,
    };

    await sendEmailWithTemplate(
      'Sua Empresa <no-reply@suaempresa.com>',
      user.email,
      'Recuperação de Senha',
      'generate-code-password',
      'generate-code-password.html',
      'styles.css',
      emailData
    );
  }
}
