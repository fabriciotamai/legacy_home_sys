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

   
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas.');
    }

  
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

   
    return {
      token,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}
