import { PrismaUserWithAddress } from '@/types';
import type { Prisma, User as PrismaUser } from '@prisma/client';
export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
    findByEmail(email: string): Promise<PrismaUser | null>;
    findByUsername(username: string): Promise<PrismaUser | null>;
    findById(userId: number): Promise<PrismaUser | null>;
    updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
    updatePassword(userId: number, hashedPassword: string): Promise<PrismaUser>;
    findUserWithAddress(id: number): Promise<PrismaUserWithAddress | null>;
}
//# sourceMappingURL=user-repository.d.ts.map