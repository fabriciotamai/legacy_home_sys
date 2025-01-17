import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GeneratePasswordResetCodeUseCase } from '@/use-cases/users/generate-password-reset-code-use-case';

export function makeGeneratePasswordResetCodeUseCase(): GeneratePasswordResetCodeUseCase {
  const userRepository = new PrismaUsersRepository();
  return new GeneratePasswordResetCodeUseCase(userRepository);
}
