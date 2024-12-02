import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { SigninUsers } from '../../users/signin-users';

export function makeUserSignin(): SigninUsers {
  const userRepository = new PrismaUsersRepository();
  return new SigninUsers(userRepository);
}
