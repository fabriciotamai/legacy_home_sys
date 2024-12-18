import type { Prisma, Address as PrismaAddress } from '@prisma/client';
export interface AddressRepository {
    create(data: Prisma.AddressCreateInput): Promise<PrismaAddress>;
    findById(addressId: number): Promise<PrismaAddress | null>;
    findByUserId(userId: number): Promise<PrismaAddress[]>;
    update(addressId: number, data: Prisma.AddressUpdateInput): Promise<PrismaAddress>;
    delete(addressId: number): Promise<void>;
    updateUserComplianceStatus(userId: number, status: Prisma.UserUpdateInput['complianceStatus']): Promise<void>;
}
//# sourceMappingURL=address-repository.d.ts.map