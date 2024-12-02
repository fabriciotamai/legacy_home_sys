import { AdminRepository } from '@/repositories/admin-repository';
import { Role, UserType } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  userType: UserType;
  numberDocument?: string;
  phone?: string;
  role: Role;
}

export class AdminRegisterUsersUseCase {
  constructor(private readonly userRepository: AdminRepository) {}

  async execute(input: RegisterUserInput): Promise<void> {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      birthDate,
      userType,
      numberDocument,
      phone,
      role,
    } = input;

    
    if (!Object.values(UserType).includes(userType)) {
      throw new Error('O tipo de usuário é inválido.');
    }

    
    if (!Object.values(Role).includes(role)) {
      throw new Error('O valor de role é inválido.');
    }

    
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('E-mail já está em uso.');
    }

    
    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Nome de usuário já está em uso.');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    await this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      userType,
      numberDocument,
      phone,
      role,
      mustChangePassword: true, 
    });
  }
}
