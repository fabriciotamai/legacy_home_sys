import type { UsersRepository } from '@/repositories/user-repository';
import { PrismaUserWithAddress } from '@/types';
import type { ConstructionType, Enterprise, Prisma, User as PrismaUser } from '@prisma/client';
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

  async findById(userId: number): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
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
        addresses: true,
      },
    });
  }

  async getWalletBalance(userId: number): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });
    return user?.walletBalance ?? 0;
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

  async getUserRecentEnterprises(userId: number): Promise<(Enterprise & { interestStatus?: string })[]> {
    const enterprises = await prisma.enterprise.findMany({
      where: {
        OR: [{ contracts: { some: { userId } } }, { contractInterests: { some: { userId } } }],
      },
      include: {
        currentPhase: true,
        currentTask: true,
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
}
