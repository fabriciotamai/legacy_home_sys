import { UsersRepository } from '@/repositories/user-repository';
import { GetAdminDashboardDataUseCase } from '@/use-cases/admin/get-admin-dashboard-use-case';
import { generateToken } from '@/utils/jwt'; // Importa a função de geração de token
import bcrypt from 'bcryptjs';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  mustChangePassword: boolean;
  token: string; // Adicionado para incluir o token no retorno
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    complianceStatus: string;
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

    // Busca o usuário pelo email
    const user = await this.userRepository.findByEmail(email);

    // Verifica se o usuário existe e se a senha está correta
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw {
        status: 401,
        message: 'E-mail ou senha estão incorretos.',
      };
    }

    // Fluxo específico para ADMIN
    if (user.role === 'ADMIN') {
      return this.handleAdminLogin(user);
    }

    // Fluxo para usuários comuns
    return this.handleUserLogin(user);
  }

  private async handleAdminLogin(user: any): Promise<LoginOutput> {
    // Gera o token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    // Busca os dados do dashboard admin
    const adminDashboard = await this.getAdminDashboardDataUseCase.execute();

    return {
      mustChangePassword: user.mustChangePassword,
      token, // Retorna o token
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

  private async handleUserLogin(user: any): Promise<LoginOutput> {
    // Atualiza a versão do token no banco de dados
    const updatedUser = await this.userRepository.updateUser(user.id, {
      tokenVersion: user.tokenVersion + 1,
    });

    // Gera o token JWT
    const token = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      tokenVersion: updatedUser.tokenVersion,
    });

    return {
      mustChangePassword: updatedUser.mustChangePassword,
      token, // Retorna o token
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: user.role,
        complianceStatus: user.complianceStatus,
      },
    };
  }
}
