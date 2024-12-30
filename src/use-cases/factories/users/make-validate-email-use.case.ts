import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { ValidateEmailUseCase } from '@/use-cases/users/user-validate-email-use-case';

export function makeValidateEmailUseCase(): ValidateEmailUseCase {
  const usersRepository = new PrismaUsersRepository();
  const validateEmailUseCase = new ValidateEmailUseCase(usersRepository);

  return validateEmailUseCase;
}
