import { UsersRepository } from '@/repositories/user-repository';

interface GetUserWithAddressOutput {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  numberDocument: string | null;
  birthDate: string | null;
  userType: string;
  phone: string | null;
  documentFront: string | null;
  documentBack: string | null;
  proofOfAddress: string | null;
  incomeTaxProof: string | null;
  complianceStatus: string;
  address?: {
    id: number;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
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
      incomeTaxProof: user.incomeTaxProof ?? null,
      proofOfAddress: user.proofOfAddress ?? null,
      complianceStatus: user.complianceStatus,
      address: user.address
        ? {
          id: user.address.id,
          street: user.address.street,
          number: user.address.number,
          complement: user.address.complement ?? undefined,
          neighborhood: user.address.neighborhood,
          city: user.address.city,
          state: user.address.state,
          postalCode: user.address.postalCode,
          country: user.address.country,
        }
        : null,
    };
  }
}
