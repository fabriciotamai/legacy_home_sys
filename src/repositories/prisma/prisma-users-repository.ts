import type { UsersRepository } from '@/repositories/user-repository';
import { PrismaUserWithAddress } from '@/types';
import type { ConstructionType, Prisma, User as PrismaUser } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return await prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<PrismaUser> {
    return await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async findByUsername(username: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(userId: number): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser> {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async findUserWithAddress(id: number): Promise<PrismaUserWithAddress | null> {
    return await prisma.user.findUnique({
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

  async countEnterprisesByType(type: ConstructionType): Promise<number> {
    return prisma.enterprise.count({
      where: { constructionType: type },
    });
  }

  async getSignedContractsWithEnterprise(userId: number) {
    return prisma.contract.findMany({
      where: {
        userId,
        status: 'SIGNED',
      },
      include: {
        enterprise: true,
      },
    });
  }
}
