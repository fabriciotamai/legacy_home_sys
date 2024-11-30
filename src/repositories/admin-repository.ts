// src/repositories/usersRepository.ts

import type { Prisma, User as PrismaUser } from '@prisma/client';

export interface AdminRepository {
  create(data: Prisma.UserCreateInput): Promise<PrismaUser>;
  findByEmail(email: string): Promise<PrismaUser | null>;
  findByUsername(username: string): Promise<PrismaUser | null>;
  findById(userId: number): Promise<PrismaUser | null>;
  updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<PrismaUser>;
}
