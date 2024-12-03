import type { Enterprise, Prisma, Address as PrismaAddress, User as PrismaUser } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { AdminRepository } from '../admin-repository';

export class PrismaAdminRepository implements AdminRepository {
  
  async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return await prisma.user.create({ data });
  }

  async findEnterpriseByName(name: string) {
    return await prisma.enterprise.findFirst({
      where: { name },
    });
  }

  async createEnterprise(data: Prisma.EnterpriseCreateInput): Promise<Enterprise> {
    return await prisma.enterprise.create({
      data,
    });
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

  
  async addAddress(userId: number, data: Prisma.AddressCreateInput): Promise<PrismaAddress> {
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
