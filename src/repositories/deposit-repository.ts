import { Deposit } from '@prisma/client';

export interface DepositsRepository {
  create(data: { userId: number; amount: number; proofUrl?: string | null }): Promise<Deposit>;
  updateProofUrl(depositId: number, proofUrl: string): Promise<Deposit>;
  updateStatus(depositId: number, status: 'PENDING' | 'APPROVED' | 'REJECTED', adminComment?: string): Promise<Deposit>;
  findPendingWithoutProof(): Promise<Deposit[]>;
  findById(depositId: number): Promise<Deposit | null>;
  findByUser(userId: number): Promise<Deposit[]>;
  findAll(status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_PROOF'): Promise<Deposit[]>;
}
