import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserRegisterUseCase } from '@/use-cases/users/user-register-use-case';

export function makeUserRegisterUseCase(): UserRegisterUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new UserRegisterUseCase(usersRepository);
}
