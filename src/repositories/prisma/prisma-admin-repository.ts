import {
  Prisma,
  Address as PrismaAddress,
  User as PrismaUser,
  User,
} from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AdminRepository } from '../admin-repository';

export class PrismaAdminRepository implements AdminRepository {
  async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return await prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async findAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        address: true,
      },
    });
  }

  async findById(userId: number): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async deleteUser(userId: number): Promise<void> {
    await prisma.user.delete({
      where: { id: userId }
    });
  }


  

  async updateUser(
    userId: number,
    data: Prisma.UserUpdateInput,
  ): Promise<PrismaUser> {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async addAddress(
    userId: number,
    data: Prisma.AddressCreateInput,
  ): Promise<PrismaAddress> {
    return await prisma.address.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findByDocument(numberDocument: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { numberDocument },
    });
  }
}
