import { Address, Prisma, User } from '@prisma/client';
export interface AdminRepository {
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(userId: number): Promise<User | null>;
    updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<User>;
    addAddress(userId: number, data: Prisma.AddressCreateInput): Promise<Address>;
    findByDocument(numberDocument: string): Promise<User | null>;
    findAllUsers(): Promise<User[]>;
}
//# sourceMappingURL=admin-repository.d.ts.map