import { UsersRepository } from '@/repositories/user-repository';
import { sendEmailWithTemplate } from '@/services/email-service';

interface GenerateEmailCodeInput {
  userId: number;
}

export class GenerateEmailCodeUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(input: GenerateEmailCodeInput): Promise<void> {
    const { userId } = input;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const emailCode = Math.floor(1000 + Math.random() * 9000).toString();

    await this.userRepository.updateUser(userId, {
      emailConfirmationCode: emailCode,
      emailConfirmationExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    const emailData = {
      name: user.username,
      code: emailCode,
    };

    await sendEmailWithTemplate(
      'Sua Empresa <no-reply@suaempresa.com>',
      user.email,
      'Código de confirmação de e-mail',
      'email-confirmation',
      'email-confirmation.html',
      'styles.css',
      emailData,
    );
  }
}
