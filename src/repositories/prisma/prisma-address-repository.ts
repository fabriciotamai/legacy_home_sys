import { ComplianceStatus, Prisma, Address as PrismaAddress } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AddressRepository } from '../address-repository';

export class PrismaAddressRepository implements AddressRepository {
  async create(data: Prisma.AddressCreateInput): Promise<PrismaAddress> {
    return await prisma.address.create({ data });
  }

  async findById(addressId: number): Promise<PrismaAddress | null> {
    return await prisma.address.findUnique({
      where: { id: addressId },
    });
  }

  // async findPhasesByEnterprise(enterpriseId: number): Promise<[]> {
  //   return prisma.phase.findMany({
  //     where: {
  //       enterprises: {
  //         some: { id: enterpriseId },
  //       },
  //     },
  //     include: {
  //       tasks: true,
  //     },
  //   });
  // }

  async updateUserComplianceStatus(userId: number, status: ComplianceStatus): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { complianceStatus: status },
    });
  }

  async findByUserId(userId: number): Promise<PrismaAddress[]> {
    return await prisma.address.findMany({
      where: { userId },
    });
  }

  async update(addressId: number, data: Prisma.AddressUpdateInput): Promise<PrismaAddress> {
    return await prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async delete(addressId: number): Promise<void> {
    await prisma.address.delete({
      where: { id: addressId },
    });
  }
}
