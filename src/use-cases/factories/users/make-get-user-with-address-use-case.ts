import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserWithAddressUseCase } from '../../users/get-user-with-address-use-case';

export function makeGetUserWithAddress(): GetUserWithAddressUseCase {
  const userRepository = new PrismaUsersRepository();
  return new GetUserWithAddressUseCase(userRepository);
}
