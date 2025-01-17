import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ResetPasswordUseCase } from '@/use-cases/users/reset-password-use-case';

export function makeResetPasswordUseCase(): ResetPasswordUseCase {
  const userRepository = new PrismaUsersRepository();
  return new ResetPasswordUseCase(userRepository);
}
