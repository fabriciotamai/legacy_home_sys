import { ComplianceStatus, Phase, Prisma, Address as PrismaAddress } from '@prisma/client';
import { AddressRepository } from '../address-repository';
export declare class PrismaAddressRepository implements AddressRepository {
    create(data: Prisma.AddressCreateInput): Promise<PrismaAddress>;
    findById(addressId: number): Promise<PrismaAddress | null>;
    findPhasesByEnterprise(enterpriseId: number): Promise<Phase[]>;
    updateUserComplianceStatus(userId: number, status: ComplianceStatus): Promise<void>;
    findByUserId(userId: number): Promise<PrismaAddress[]>;
    update(addressId: number, data: Prisma.AddressUpdateInput): Promise<PrismaAddress>;
    delete(addressId: number): Promise<void>;
}
//# sourceMappingURL=prisma-address-repository.d.ts.map