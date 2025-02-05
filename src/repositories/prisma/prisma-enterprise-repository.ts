import { prisma } from '@/lib/prisma';
import { EnterpriseWithRelations } from '@/types';
import {
  ContractInterest,
  Enterprise,
  EnterpriseStatus,
  InterestStatus,
  Investment,
  Prisma,
  Role,
} from '@prisma/client';
import { EnterpriseRepository } from '../enterprise-repository';

const getClient = (tx?: Prisma.TransactionClient) => tx ?? prisma;

export class PrismaEnterpriseRepository implements EnterpriseRepository {
  async findById(enterpriseId: number, tx?: Prisma.TransactionClient): Promise<Enterprise> {
    return getClient(tx).enterprise.findUniqueOrThrow({
      where: { id: enterpriseId },
    });
  }

  async deleteImagesByEnterprise(enterpriseId: number, imageUrls: string[]): Promise<void> {
    await prisma.enterpriseImage.deleteMany({
      where: {
        enterpriseId,
        imageUrl: { in: imageUrls },
      },
    });
  }

  async findInvestmentsByEnterpriseId(enterpriseId: number): Promise<Investment[]> {
    return prisma.investment.findMany({
      where: { enterpriseId },
      include: { user: true },
    });
  }

  async findImageUrlsByEnterpriseId(enterpriseId: number, skip: number = 0, take: number = 10): Promise<string[]> {
    const images = await prisma.enterpriseImage.findMany({
      where: { enterpriseId },
      select: { imageUrl: true },
      skip,
      take,
      orderBy: { createdAt: 'asc' },
    });
    return images.map((img) => img.imageUrl);
  }

  async findApprovedInterestByUserAndEnterprise(
    userId: number,
    enterpriseId: number
  ): Promise<ContractInterest | null> {
    return prisma.contractInterest.findFirst({
      where: {
        userId,
        enterpriseId,
        status: InterestStatus.APPROVED,
      },
    });
  }

  async countImagesByEnterpriseId(enterpriseId: number): Promise<number> {
    return prisma.enterpriseImage.count({
      where: { enterpriseId },
    });
  }

  async getPaginatedImageUrlsByEnterpriseId(
    enterpriseId: number,
    page: number,
    limit: number
  ): Promise<{ images: string[]; total: number }> {
    const skip = (page - 1) * limit;
    const [images, total] = await Promise.all([
      prisma.enterpriseImage.findMany({
        where: { enterpriseId },
        select: { imageUrl: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.enterpriseImage.count({
        where: { enterpriseId },
      }),
    ]);
    return {
      images: images.map((img) => img.imageUrl),
      total,
    };
  }

  async addInterestLog(
    data: {
      userId: number;
      enterpriseId: number;
      interestId: string;
      status: InterestStatus;
      reason?: string;
    },
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    await getClient(tx).interestLog.create({
      data: {
        userId: data.userId,
        enterpriseId: data.enterpriseId,
        interestId: data.interestId,
        status: data.status,
        reason: data.reason,
      },
    });
  }

  async addInvestment(
    data: {
      userId: number;
      enterpriseId: number;
      investedAmount: number;
    },
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    await getClient(tx).investment.create({
      data: {
        userId: data.userId,
        enterpriseId: data.enterpriseId,
        investedAmount: data.investedAmount,
      },
    });
  }

  async findByName(name: string): Promise<Enterprise | null> {
    return prisma.enterprise.findFirst({ where: { name } });
  }

  async findAll(filters: {
    status?: EnterpriseStatus;
    investmentType?: 'MONEY' | 'PROPERTY';
    isAvailable?: boolean;
  }): Promise<EnterpriseWithRelations[]> {
    const where: Prisma.EnterpriseWhereInput = {};
    if (filters.status !== undefined) where.status = filters.status;
    if (filters.investmentType !== undefined) where.investmentType = filters.investmentType;
    if (filters.isAvailable !== undefined) where.isAvailable = filters.isAvailable;
    return prisma.enterprise.findMany({
      where,
      include: {
        contractInterests: true,
        investments: true,
      },
      orderBy: { createdAt: 'desc' },
    }) as Promise<EnterpriseWithRelations[]>;
  }

  async create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise> {
    return prisma.enterprise.create({ data });
  }

  async createMany(enterpriseId: number, imageUrls: string[]): Promise<void> {
    if (imageUrls.length === 0) return;
    await prisma.$transaction(async (tx) => {
      await tx.enterpriseImage.createMany({
        data: imageUrls.map((url) => ({ enterpriseId, imageUrl: url })),
      });
    });
  }

  async findByEnterpriseId(enterpriseId: number): Promise<string[]> {
    const images = await prisma.enterpriseImage.findMany({
      where: { enterpriseId },
      select: { imageUrl: true },
    });
    return images.map((img) => img.imageUrl);
  }

  async deleteEnterprise(enterpriseId: number): Promise<void> {
    await prisma.enterprise.delete({ where: { id: enterpriseId } });
  }

  async update(enterpriseId: number, data: Prisma.EnterpriseUpdateInput): Promise<Enterprise> {
    return prisma.enterprise.update({ where: { id: enterpriseId }, data });
  }

  async updateEnterpriseProgress(enterpriseId: number, progress: number): Promise<void> {
    await prisma.enterprise.update({
      where: { id: enterpriseId },
      data: { progress },
    });
  }

  async linkUserToEnterprise(
    userId: number,
    enterpriseId: number,
    status: InterestStatus = InterestStatus.PENDING,
    tx?: Prisma.TransactionClient
  ): Promise<ContractInterest> {
    return getClient(tx).contractInterest.create({
      data: { userId, enterpriseId, status },
    });
  }

  async removeOtherInterests(enterpriseId: number, interestId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await getClient(tx).contractInterest.updateMany({
      where: {
        enterpriseId,
        interestId: { not: interestId },
      },
      data: { status: InterestStatus.REJECTED },
    });
  }

  async findWithInterests(): Promise<Enterprise[]> {
    return prisma.enterprise.findMany({
      where: {
        contractInterests: {
          some: { status: InterestStatus.PENDING },
        },
      },
      include: {
        contractInterests: {
          where: { status: InterestStatus.PENDING },
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: number): Promise<
    (Enterprise & {
      contractInterests: { status: string }[];
      contracts: {
        clientSigningUrl: string | null;
        adminSigningUrl: string | null;
        signatures: {
          userId: number | null;
          role: Role;
          signedAt: Date | null;
        }[];
      }[];
    })[]
  > {
    return prisma.enterprise.findMany({
      where: {
        OR: [{ contracts: { some: { userId } } }, { contractInterests: { some: { userId } } }],
      },
      include: {
        contractInterests: {
          where: { userId },
          select: { status: true },
          take: 1,
        },
        contracts: {
          where: { userId },
          select: {
            clientSigningUrl: true,
            adminSigningUrl: true,
            signatures: {
              select: { userId: true, role: true, signedAt: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addChangeLog(data: {
    enterpriseId: number;
    changeType: 'STATUS_CHANGED' | 'PHASE_CHANGED' | 'TASK_CHANGED';
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await prisma.enterpriseChangeLog.create({
      data: {
        enterpriseId: data.enterpriseId,
        changeType: data.changeType,
        description: data.description,
        metadata: (data.metadata as Prisma.InputJsonValue) || undefined,
      },
    });
  }

  async findSingleInvestmentByEnterpriseId(enterpriseId: number): Promise<Investment | null> {
    return prisma.investment.findFirst({ where: { enterpriseId } });
  }
}
