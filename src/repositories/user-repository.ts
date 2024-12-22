import { PrismaUserWithAddress } from '@/types';
import type { ConstructionType, ContractInterest, Enterprise, Prisma, User as PrismaUser } from '@prisma/client';

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
  findByEmail(email: string): Promise<PrismaUser | null>;
  findByUsername(username: string): Promise<PrismaUser | null>;
  findById(userId: number): Promise<PrismaUser | null>;
  updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
  updatePassword(userId: number, hashedPassword: string): Promise<PrismaUser>;
  findUserWithAddress(id: number): Promise<PrismaUserWithAddress | null>;
  getWalletBalance(userId: number): Promise<number>;
  countEnterprisesByType(userId: number, type: ConstructionType): Promise<number>;
  getApprovedContractsWithEnterprise(
    userId: number,
  ): Promise<(ContractInterest & { enterprise: { id: number; fundingAmount: number; transferAmount: number } })[]>;
  getRecentEnterprisesWithoutApprovedInterests(): Promise<Enterprise[]>;
  getUserRecentEnterprises(userId: number): Promise<(Enterprise & { interestStatus?: string })[]>;
  updateWalletBalance(userId: number, newBalance: number): Promise<void>;
  updateUserFinancials(
    userId: number,
    walletBalance: number,
    investedIncrement: number,
    valuationIncrement: number,
  ): Promise<void>;
}
