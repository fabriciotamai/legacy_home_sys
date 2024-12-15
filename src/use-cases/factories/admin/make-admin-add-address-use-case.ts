import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository';
import { AddAddressUseCase } from '@/use-cases/users/user-address-use-case';

export function makeAdminAddAddressUseCase(): AddAddressUseCase {
  const addressRepository = new PrismaAddressRepository();
  return new AddAddressUseCase(addressRepository);
}
