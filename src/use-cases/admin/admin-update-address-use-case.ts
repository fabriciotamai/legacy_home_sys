import { AddressRepository } from '@/repositories/address-repository';

interface UpdateAddressInput {
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

export class AdminUpdateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(input: UpdateAddressInput): Promise<void> {
    const { userId, street, number, complement, neighborhood, city, state, postalCode, country } = input;

    const existingAddresses = await this.addressRepository.findByUserId(userId);

    if (existingAddresses.length > 0) {
      await this.addressRepository.update(existingAddresses[0].id, {
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
    }
  }
}
