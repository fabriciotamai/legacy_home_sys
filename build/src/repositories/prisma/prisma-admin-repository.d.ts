import { Prisma, Address as PrismaAddress, User as PrismaUser, User } from '@prisma/client';
import { AdminRepository } from '../admin-repository';
export declare class PrismaAdminRepository implements AdminRepository {
    create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
    findByEmail(email: string): Promise<PrismaUser | null>;
    findByUsername(username: string): Promise<PrismaUser | null>;
    findAllUsers(): Promise<User[]>;
    findById(userId: number): Promise<PrismaUser | null>;
    updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
    addAddress(userId: number, data: Prisma.AddressCreateInput): Promise<PrismaAddress>;
    findByDocument(numberDocument: string): Promise<PrismaUser | null>;
}
//# sourceMappingURL=prisma-admin-repository.d.ts.map