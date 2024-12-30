import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GenerateEmailCodeUseCase } from '@/use-cases/users/generate-email-code-use-case';

export function makeGenerateEmailCodeUseCase(): GenerateEmailCodeUseCase {
  const usersRepository = new PrismaUsersRepository();
  const generateEmailCodeUseCase = new GenerateEmailCodeUseCase(usersRepository);

  return generateEmailCodeUseCase;
}
