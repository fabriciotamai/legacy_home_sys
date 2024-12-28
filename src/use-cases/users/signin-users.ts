import { UsersRepository } from '@/repositories/user-repository';
import { sendEmailWithTemplate } from '@/services/email-service';
import { GetAdminDashboardDataUseCase } from '@/use-cases/admin/get-admin-dashboard-use-case';
import { generateToken } from '@/utils/jwt';
import bcrypt from 'bcryptjs';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  token?: string;
  mustChangePassword: boolean;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    complianceStatus: string;
  };
  message?: string;
  adminDashboard?: any;
}

export class SigninUsers {
  private readonly emailTemplateName = 'email-confirmation.html';
  private readonly cssTemplateName = 'styles.css';

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly getAdminDashboardDataUseCase: GetAdminDashboardDataUseCase,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw {
        status: 401,
        message: 'E-mail ou senha estão incorretos.',
      };
    }

    if (user.role === 'ADMIN') {
      return this.handleAdminLogin(user);
    }

    if (user.complianceStatus === 'PENDING_EMAIL') {
      return this.handlePendingEmail(user);
    }

    return this.handleUserLogin(user);
  }

  private async handleAdminLogin(user: any): Promise<LoginOutput> {
    const adminDashboard = await this.getAdminDashboardDataUseCase.execute();

    return {
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        complianceStatus: user.complianceStatus,
      },
      adminDashboard,
    };
  }

  private async handlePendingEmail(user: any): Promise<LoginOutput> {
    const emailToken = this.generateEmailToken();

    await this.userRepository.updateUser(user.id, {
      twoFA: emailToken,
    });

    await sendEmailWithTemplate(
      'Sua Empresa <no-reply@suaempresa.com>',
      user.email,
      'Confirmação de E-mail',
      this.emailTemplateName,
      this.cssTemplateName,
      {
        name: user.firstName,
        token: emailToken,
      },
    );

    return {
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        complianceStatus: user.complianceStatus,
      },
      message: 'Um código de confirmação foi enviado para o seu e-mail.',
    };
  }

  private async handleUserLogin(user: any): Promise<LoginOutput> {
    const updatedUser = await this.userRepository.updateUser(user.id, {
      tokenVersion: user.tokenVersion + 1,
    });

    const token = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      tokenVersion: updatedUser.tokenVersion,
    });

    return {
      token,
      mustChangePassword: updatedUser.mustChangePassword,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        complianceStatus: user.complianceStatus,
      },
    };
  }

  private generateEmailToken(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
