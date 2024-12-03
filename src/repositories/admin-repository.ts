import type { Enterprise, Prisma, Address as PrismaAddress, Enterprise as PrismaEnterprise, User as PrismaUser } from '@prisma/client';

export interface AdminRepository {
  create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
  findByEmail(email: string): Promise<PrismaUser | null>;
  findByUsername(username: string): Promise<PrismaUser | null>;
  findById(userId: number): Promise<PrismaUser | null>;
  updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
  findByDocument(numberDocument: string): Promise<PrismaUser | null>;
  addAddress(userId: number, data: Prisma.AddressCreateInput): Promise<PrismaAddress>;
  findEnterpriseByName(name: string): Promise<PrismaEnterprise | null>; 
  createEnterprise(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>; 
}
