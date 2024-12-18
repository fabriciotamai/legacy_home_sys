import type { UsersRepository } from '@/repositories/user-repository';
import { PrismaUserWithAddress } from '@/types';
import type { Prisma, User as PrismaUser } from '@prisma/client';
export declare class PrismaUsersRepository implements UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
    findByEmail(email: string): Promise<PrismaUser | null>;
    updatePassword(userId: number, hashedPassword: string): Promise<PrismaUser>;
    findByUsername(username: string): Promise<PrismaUser | null>;
    findById(userId: number): Promise<PrismaUser | null>;
    updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
    findUserWithAddress(id: number): Promise<PrismaUserWithAddress | null>;
}
//# sourceMappingURL=prisma-users-repository.d.ts.map