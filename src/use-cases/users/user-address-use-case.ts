import { AddressRepository } from '@/repositories/address-repository';

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

  async execute(input: AddAddressInput): Promise<void> {
    const { userId, street, number, complement, neighborhood, city, state, postalCode, country } = input;

    const existingAddresses = await this.addressRepository.findByUserId(userId);
    if (existingAddresses.length > 0) {
      throw new Error('Usuário já possui um endereço cadastrado.');
    }

    await this.addressRepository.create({
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
}
