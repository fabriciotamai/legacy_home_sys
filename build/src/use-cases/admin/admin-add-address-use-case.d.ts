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
export declare class AdminAddAddressUseCase {
    private readonly addressRepository;
    constructor(addressRepository: AddressRepository);
    execute(input: AddAddressInput): Promise<void>;
}
export {};
//# sourceMappingURL=admin-add-address-use-case.d.ts.map