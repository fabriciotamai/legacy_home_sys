import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UpdateUserProfileUseCase } from '@/use-cases/users/user-update-profile-use.case';

export function makeUpdateUserProfileUseCase(): UpdateUserProfileUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new UpdateUserProfileUseCase(usersRepository);
}
