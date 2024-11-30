import { type AdminRepository } from '@/repositories/admin-repository';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
  numberDocument?: string;
  phone?: string;
  role: Role;
}

export class AdminRegisterUsersUseCase {
  constructor(private readonly userRepository: AdminRepository) {}

  async execute(input: RegisterUserInput): Promise<void> {
    const { email, username, password, numberDocument, phone, role } = input;

    
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
      numberDocument,
      phone,
      role,
    });
  }
}
