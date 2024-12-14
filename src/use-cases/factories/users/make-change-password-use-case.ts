import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ChangePasswordUseCase } from '../../users/change-password-use-case';

export function makeChangePassword(): ChangePasswordUseCase {
  const userRepository = new PrismaUsersRepository();
  return new ChangePasswordUseCase(userRepository);
}
