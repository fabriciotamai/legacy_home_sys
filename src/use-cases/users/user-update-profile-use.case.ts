import { UsersRepository } from '@/repositories/user-repository';
import { UserType } from '@prisma/client';

export interface UpdateUserProfileRequest {
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  numberDocument?: string;
  userType?: UserType;
  birthDate?: Date;
  avatar?: string;
}

export interface UpdateUserProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  numberDocument?: string | null;
  userType: UserType;
  birthDate?: Date | null;
  avatar?: string | null;
}

export class UpdateUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    
    const { userId, ...updateData } = request;

    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser) {
      throw new Error('Usuário não encontrado.');
    }

   
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await this.usersRepository.findByEmail(updateData.email);
      if (emailExists) {
        throw new Error('Esse email já está em uso.');
      }
    }

 
    const updatedUser = await this.usersRepository.updateUser(userId, updateData);


    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      numberDocument: updatedUser.numberDocument ?? null,
      userType: updatedUser.userType,
      birthDate: updatedUser.birthDate ?? null,
      avatar: updatedUser.avatar ?? null,
    };
  }
}
