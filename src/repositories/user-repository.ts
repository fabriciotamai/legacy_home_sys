import { PrismaUserWithAddress } from '@/types';
import type { Contract, Prisma, User as PrismaUser } from '@prisma/client';

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
  findByEmail(email: string): Promise<PrismaUser | null>;
  findByUsername(username: string): Promise<PrismaUser | null>;
  findById(userId: number): Promise<PrismaUser | null>;
  updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
  updatePassword(userId: number, hashedPassword: string): Promise<PrismaUser>;
  findUserWithAddress(id: number): Promise<PrismaUserWithAddress | null>;
  getWalletBalance(userId: number): Promise<number>;
  countEnterprisesByType(type: string): Promise<number>;
  getSignedContractsWithEnterprise(
    userId: number,
  ): Promise<(Contract & { enterprise: { fundingAmount: number; transferAmount: number } })[]>;
}
