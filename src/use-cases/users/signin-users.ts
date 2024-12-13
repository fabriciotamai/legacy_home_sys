import { UsersRepository } from '@/repositories/user-repository';
import { generateToken } from '@/utils/jwt';
import bcrypt from 'bcryptjs';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  token: string;
  mustChangePassword: boolean;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

export class SigninUsers {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;

    // Busca o usuário pelo email
    const user = await this.userRepository.findByEmail(email);

    // Verifica se o usuário existe e se a senha é válida
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw {
        status: 401,
        message: 'E-mail ou senha estão incorretos.', // Mensagem clara e específica
      };
    }

    // Incrementa a versão do token no banco de dados
    const updatedUser = await this.userRepository.updateUser(user.id, {
      tokenVersion: user.tokenVersion + 1,
    });

    // Gera o token com a nova versão do token
    const token = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      tokenVersion: updatedUser.tokenVersion,
    });

    // Retorna o token e os dados do usuário
    return {
      token,
      mustChangePassword: updatedUser.mustChangePassword,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
      },
    };
  }
}
