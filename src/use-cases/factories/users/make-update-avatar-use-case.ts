import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdateUserAvatarUseCase } from '@/use-cases/users/update-user-avatar-use-case';

export function makeUpdateUserAvatarUseCase(): UpdateUserAvatarUseCase {
  const usersRepository = new PrismaUsersRepository();

  return new UpdateUserAvatarUseCase(usersRepository);
}
