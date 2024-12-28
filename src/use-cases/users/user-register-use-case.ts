import { UsersRepository } from '@/repositories/user-repository';
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
}

export class UserRegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: RegisterUserInput): Promise<void> {
    const { email, username, password, firstName, lastName, birthDate, userType, numberDocument, phone } = input;

    if (!email || !username || !password || !firstName || !lastName || !userType) {
      throw new Error('Campos obrigatórios estão faltando.');
    }

    if (!Object.values(UserType).includes(userType)) {
      throw new Error('Tipo de usuário inválido.');
    }

    const existingUserByEmail = await this.usersRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('E-mail já está em uso.');
    }

    const existingUserByUsername = await this.usersRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('Nome de usuário já está em uso.');
    }

    if (numberDocument) {
      const existingUserByDocument = await this.usersRepository.findByDocument(numberDocument);
      if (existingUserByDocument) {
        throw new Error('Número de documento já está em uso.');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const parsedBirthDate = birthDate ? new Date(birthDate) : undefined;

    await this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate: parsedBirthDate,
      userType,
      numberDocument,
      phone,
      role: Role.USER,
      mustChangePassword: false,
      isApproved: false,
      complianceStatus: 'PENDING_EMAIL',
    });
  }
}
