import { prisma } from '@/lib/prisma';
import { Contract, ContractSignature, ContractStatus, Prisma } from '@prisma/client';
import { ContractRepository } from '../contract-repository';

export class PrismaContractRepository implements ContractRepository {

  async create(data: Prisma.ContractCreateInput): Promise<Contract> {
    return await prisma.contract.create({ data });
  }


  async findById(contractId: string): Promise<Contract | null> {
    return await prisma.contract.findUnique({ where: { id: contractId } });
  }


  async updateStatus(contractId: string, status: ContractStatus): Promise<Contract> {
    return prisma.contract.update({
      where: { id: contractId },
      data: { status },
      include: { signatures: true },
    });
  }

  
  async setEnvelopeId(contractId: string, envelopeId: string): Promise<Contract> {
    return prisma.contract.update({
      where: { id: contractId },
      data: { documentUrl: envelopeId },
    });
  }

 
  async createSignature(data: Prisma.ContractSignatureCreateInput): Promise<ContractSignature> {
    return prisma.contractSignature.create({ data });
  }
}
