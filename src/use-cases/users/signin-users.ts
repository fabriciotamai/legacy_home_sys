import { UsersRepository } from '@/repositories/user-repository';
import { GetAdminDashboardDataUseCase } from '@/use-cases/admin/get-admin-dashboard-use-case';
import { generateToken } from '@/utils/jwt';
import bcrypt from 'bcryptjs';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    complianceStatus: string;
    mustChangePassword: boolean;
  };
  adminDashboard?: any;
}

export class SigninUsers {
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

    return this.handleUserLogin(user);
  }

  private async handleAdminLogin(user: any): Promise<LoginOutput> {
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const adminDashboard = await this.getAdminDashboardDataUseCase.execute();
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        complianceStatus: user.complianceStatus,
        mustChangePassword: user.mustChangePassword,
      },
      adminDashboard,
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
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: user.role,
        complianceStatus: user.complianceStatus,
        mustChangePassword: updatedUser.mustChangePassword,
      },
    };
  }
}
