import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { SendDocumentsUseCase } from '@/use-cases/users/send-document-use-case';

export function makeSendDocumentsUseCase(): SendDocumentsUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new SendDocumentsUseCase(usersRepository);
}
