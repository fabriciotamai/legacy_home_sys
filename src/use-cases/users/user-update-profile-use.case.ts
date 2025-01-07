import { UsersRepository } from '@/repositories/user-repository';
import { UserType } from '@prisma/client';
import { z } from 'zod';

interface UpdateUserProfileRequest {
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  numberDocument?: string;
  userType?: UserType;
  birthDate?: Date;
  avatar?: string;
}

export class UpdateUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: UpdateUserProfileRequest): Promise<void> {
    const updateSchema = z.object({
      firstName: z.string().min(1, 'Nome é obrigatório.').optional(),
      lastName: z.string().min(1, 'Sobrenome é obrigatório.').optional(),
      email: z.string().email('Email inválido.').optional(),
      numberDocument: z.string().optional(),
      userType: z.nativeEnum(UserType).optional(),
      birthDate: z.coerce.date().optional(),
      avatar: z.string().url('Avatar deve ser uma URL válida.').optional(),
    });

    const validatedData = updateSchema.parse(request);

    const existingUser = await this.usersRepository.findById(request.userId);
    if (!existingUser) {
      throw new Error('Usuário não encontrado.');
    }

    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await this.usersRepository.findByEmail(
        validatedData.email,
      );
      if (emailExists) {
        throw new Error('Esse email já está em uso.');
      }
    }

    await this.usersRepository.updateUser(request.userId, validatedData);
  }
}
