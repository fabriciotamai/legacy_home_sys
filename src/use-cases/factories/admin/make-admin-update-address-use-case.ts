import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository';
import { AdminUpdateAddressUseCase } from '@/use-cases/admin/admin-update-address-use-case';

export function makeAdminUpdateAddressUseCase(): AdminUpdateAddressUseCase {
  const addressRepository = new PrismaAddressRepository();
  return new AdminUpdateAddressUseCase(addressRepository);
}
