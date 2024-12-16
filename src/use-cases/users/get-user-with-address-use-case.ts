import { UsersRepository } from '@/repositories/user-repository';

interface GetUserWithAddressOutput {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  numberDocument: string | null; //
  birthDate: string | null;
  userType: string;
  phone: string | null;
  documentFront: string | null;
  documentBack: string | null;
  proofOfAddress: string | null;
  complianceStatus: string;
  addresses: {
    id: number;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
}

export class GetUserWithAddressUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: number): Promise<GetUserWithAddressOutput> {
    const user = await this.usersRepository.findUserWithAddress(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      numberDocument: user.numberDocument ?? null,
      birthDate: user.birthDate?.toISOString() ?? null,
      userType: user.userType,
      phone: user.phone ?? null,
      documentFront: user.documentFront ?? null,
      documentBack: user.documentBack ?? null,
      proofOfAddress: user.proofOfAddress ?? null,
      complianceStatus: user.complianceStatus,
      addresses: user.addresses.map((address) => ({
        id: address.id,
        street: address.street,
        number: address.number,
        complement: address.complement ?? undefined,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      })),
    };
  }
}
