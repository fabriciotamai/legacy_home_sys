import { AdminRepository } from '@/repositories/admin-repository';
import { Role, UserType } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate?: string; 
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

    
    if (!email || !username || !password || !firstName || !lastName || !userType || !role) {
      throw new Error('Campos obrigatórios estão faltando.');
    }

    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('E-mail já está em uso.');
    }

    
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('Nome de usuário já está em uso.');
    }

    
    if (numberDocument) {
      const existingUserByDocument = await this.userRepository.findByDocument(numberDocument);
      if (existingUserByDocument) {
        throw new Error('Número de documento já está em uso.');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const parsedBirthDate = birthDate ? new Date(birthDate) : undefined;

    
    await this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate: parsedBirthDate,
      userType,
      numberDocument,
      phone,
      role,
      isApproved: false, 
      complianceStatus: 'PENDING_ADDRESS', 
    });
  }
}
