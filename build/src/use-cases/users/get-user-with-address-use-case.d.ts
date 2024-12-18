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
export declare class GetUserWithAddressUseCase {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    execute(userId: number): Promise<GetUserWithAddressOutput>;
}
export {};
//# sourceMappingURL=get-user-with-address-use-case.d.ts.map