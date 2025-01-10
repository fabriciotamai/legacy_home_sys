import { UsersRepository } from '@/repositories/user-repository';

interface UpdateUserAvatarRequest {
  userId: number;
  avatarFile: string;
}

export class UpdateUserAvatarUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(request: UpdateUserAvatarRequest) {
    const { userId, avatarFile } = request;

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    
    await this.usersRepository.updateUser(userId, {
      avatar: avatarFile || null, 
    });


    const updatedUser = await this.usersRepository.findById(userId);

    if (!updatedUser) {
      throw new Error('Erro ao atualizar o usuário.');
    }

    return updatedUser;
  }
}
