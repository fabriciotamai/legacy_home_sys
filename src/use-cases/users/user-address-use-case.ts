// AddAddressUseCase.ts

import { AddressRepository } from '@/repositories/address-repository';
import { Address } from '@prisma/client';

interface AddAddressInput {
  userId: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export class AddAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(input: AddAddressInput): Promise<Address> { // Alterado para retornar Address
    const { userId, street, number, complement, neighborhood, city, state, postalCode, country } = input;

    const existingAddresses = await this.addressRepository.findByUserId(userId);

    let address: Address;

    if (existingAddresses.length > 0) {
      address = await this.addressRepository.update(existingAddresses[0].id, {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        postalCode,
        country,
      });
    } else {
      address = await this.addressRepository.create({
        user: { connect: { id: userId } },
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        postalCode,
        country,
      });

      await this.addressRepository.updateUserComplianceStatus(userId, 'PENDING_DOCUMENTS');
    }

    return address; // Retorna o endereço atualizado
  }
}
