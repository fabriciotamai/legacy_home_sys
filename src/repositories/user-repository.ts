import { PrismaUserWithAddress } from '@/types';
import {
  ConstructionType,
  ContractInterest,
  Enterprise,
  Prisma,
  User as PrismaUser,
  WalletTransactionType,
} from '@prisma/client';

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
  findByEmail(email: string): Promise<PrismaUser | null>;
  findByUsername(username: string): Promise<PrismaUser | null>;
  findByDocument(document: string): Promise<PrismaUser | null>;
  findById(userId: number, tx?: Prisma.TransactionClient): Promise<PrismaUser | null>;
  updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
  updatePassword(userId: number, hashedPassword: string): Promise<PrismaUser>;
  findUserWithAddress(id: number): Promise<PrismaUserWithAddress | null>;
  getWalletBalance(userId: number): Promise<number>;
  countEnterprisesByType(userId: number, type: ConstructionType): Promise<number>;
  getApprovedContractsWithEnterprise(userId: number): Promise<
    (ContractInterest & {
      enterprise: { id: number; fundingAmount: number; transferAmount: number };
    })[]
  >;
  getRecentEnterprisesWithoutApprovedInterests(): Promise<Enterprise[]>;
  getUserRecentEnterprises(userId: number): Promise<(Enterprise & { interestStatus?: string })[]>;
  updateWalletBalance(userId: number, newBalance: number): Promise<void>;
  updateUserFinancials(
    userId: number,
    newFiatBalance: number,
    investedIncrement: number,
    valuationIncrement: number,
    tx?: Prisma.TransactionClient
  ): Promise<void>;
  addWalletTransaction(
    data: {
      userId: number;
      type: WalletTransactionType;
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      description: string;
    },
    tx?: Prisma.TransactionClient
  ): Promise<void>;
  findUsersByIds(userIds: number[]): Promise<PrismaUser[]>;
  updatePasswordResetCode(email: string, resetCode: string, expiresAt: Date): Promise<void>;
  verifyPasswordResetCode(email: string, code: string): Promise<boolean>;
  resetPassword(email: string, hashedPassword: string): Promise<void>;
  getAllRecentEnterprises(): Promise<Enterprise[]>;
  getAllUserEnterprises(userId: number): Promise<Enterprise[]>;
  getUserFinancials(userId: number): Promise<{ totalValuation: number; totalInvested: number }>;
}
