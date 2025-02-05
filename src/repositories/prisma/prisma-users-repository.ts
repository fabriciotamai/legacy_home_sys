// src/repositories/users-repository.ts

import type { UsersRepository } from '@/repositories/user-repository';
import { PrismaUserWithAddress } from '@/types';
import type { ConstructionType, Enterprise, Prisma, User as PrismaUser, WalletTransactionType } from '@prisma/client';
import Decimal from 'decimal.js';
import { prisma } from '../../lib/prisma';

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<PrismaUser> {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async findByUsername(username: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async updatePasswordResetCode(email: string, resetCode: string, expiresAt: Date): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode: resetCode,
        passwordResetExpires: expiresAt,
      },
    });
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { passwordResetCode: true, passwordResetExpires: true },
    });

    if (!user || !user.passwordResetCode || !user.passwordResetExpires) {
      return false;
    }

    if (user.passwordResetCode !== code || user.passwordResetExpires < new Date()) {
      return false;
    }
    return true;
  }

  async resetPassword(email: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetExpires: null,
      },
    });
  }

  async findById(userId: number, tx?: Prisma.TransactionClient): Promise<PrismaUser | null> {
    return (tx ?? prisma).user.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async findUserWithAddress(id: number): Promise<PrismaUserWithAddress | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });
  }

  async getWalletBalance(userId: number): Promise<number> {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: { fiatBalance: true },
    });
    return wallet ? new Decimal(wallet.fiatBalance).toNumber() : 0;
  }

  async countEnterprisesByType(userId: number, type: ConstructionType): Promise<number> {
    return prisma.enterprise.count({
      where: {
        constructionType: type,
        contractInterests: {
          some: {
            userId: userId,
            status: 'APPROVED',
          },
        },
      },
    });
  }

  async findUsersByIds(userIds: number[]): Promise<PrismaUser[]> {
    return prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
    });
  }

  async getRecentEnterprisesWithoutApprovedInterests() {
    return prisma.enterprise.findMany({
      where: {
        contractInterests: {
          none: {
            status: 'APPROVED',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });
  }

  async getAllRecentEnterprises(): Promise<Enterprise[]> {
    return prisma.enterprise.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contractInterests: true,
      },
    });
  }

  async getAllUserEnterprises(userId: number): Promise<Enterprise[]> {
    return prisma.enterprise.findMany({
      where: { investments: { some: { userId } } },
      orderBy: { createdAt: 'desc' },
      include: {
        contractInterests: true,
      },
    });
  }

  async getUserRecentEnterprises(userId: number): Promise<(Enterprise & { interestStatus?: string })[]> {
    const enterprises = await prisma.enterprise.findMany({
      where: {
        OR: [{ contracts: { some: { userId } } }, { contractInterests: { some: { userId } } }],
      },
      include: {
        contractInterests: {
          where: { userId },
          select: { status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return enterprises.map((enterprise) => {
      const interestStatus = enterprise.contractInterests[0]?.status ?? undefined;
      const { contractInterests, ...rest } = enterprise;
      return { ...rest, interestStatus };
    });
  }

  async getApprovedContractsWithEnterprise(userId: number) {
    return prisma.contractInterest.findMany({
      where: {
        userId: userId,
        status: 'APPROVED',
      },
      include: {
        enterprise: {
          select: {
            id: true,
            fundingAmount: true,
            transferAmount: true,
          },
        },
      },
    });
  }

  async updateWalletBalance(userId: number, newBalance: number): Promise<void> {
    await prisma.wallet.update({
      where: { userId },
      data: {
        fiatBalance: new Decimal(newBalance).toString(),
      },
    });
  }

  async updateUserFinancials(
    userId: number,
    newFiatBalance: number,
    investedIncrement: number,
    valuationIncrement: number,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    await (tx ?? prisma).wallet.update({
      where: { userId },
      data: {
        fiatBalance: new Decimal(newFiatBalance).toString(),
      },
    });

    await (tx ?? prisma).user.update({
      where: { id: userId },
      data: {
        totalInvested: {
          increment: investedIncrement,
        },
        totalValuation: {
          increment: valuationIncrement,
        },
      },
    });
  }

  async findByDocument(document: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { numberDocument: document },
    });
  }

  async addWalletTransaction(
    data: {
      userId: number;
      type: WalletTransactionType;
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      description: string;
    },
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const wallet = await (tx ?? prisma).wallet.findUnique({
      where: { userId: data.userId },
      select: { id: true },
    });

    if (!wallet) {
      throw new Error('Wallet not found for userId: ' + data.userId);
    }

    await (tx ?? prisma).walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: data.type,
        amount: new Decimal(data.amount).toString(),
        balanceBefore: new Decimal(data.balanceBefore).toString(),
        balanceAfter: new Decimal(data.balanceAfter).toString(),
        description: data.description,
      },
    });
  }

  async getUserFinancials(userId: number): Promise<{ totalValuation: number; totalInvested: number }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalValuation: true,
        totalInvested: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      totalValuation: user.totalValuation ?? 0,
      totalInvested: user.totalInvested ?? 0,
    };
  }
}
