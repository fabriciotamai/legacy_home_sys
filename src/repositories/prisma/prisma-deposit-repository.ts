import { DepositsRepository } from '@/repositories/deposit-repository';
import { Deposit } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaDepositsRepository implements DepositsRepository {
  async create(data: { userId: number; amount: number; proofUrl?: string }): Promise<Deposit> {
    const status = data.proofUrl ? 'PENDING' : 'WAITING_PROOF';
    return prisma.deposit.create({
      data: {
        user: {
          connect: { id: data.userId }, // Conecta o userId ao campo user
        },
        amount: data.amount,
        proofUrl: data.proofUrl || null,
        status,
      },
    });
  }

  async updateProofUrl(depositId: number, proofUrl: string): Promise<Deposit> {
    return prisma.deposit.update({
      where: { id: depositId },
      data: { proofUrl, status: 'PENDING' },
    });
  }

  async updateStatus(
    depositId: number,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    adminComment?: string,
  ): Promise<Deposit> {
    return prisma.deposit.update({
      where: { id: depositId },
      data: { status, adminComment },
    });
  }

  async findPendingWithoutProof(): Promise<Deposit[]> {
    return prisma.deposit.findMany({
      where: {
        status: 'WAITING_PROOF',
      },
    });
  }

  async findById(depositId: number): Promise<Deposit | null> {
    return prisma.deposit.findUnique({
      where: { id: depositId },
    });
  }

  async findByUser(userId: number): Promise<Deposit[]> {
    return prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
