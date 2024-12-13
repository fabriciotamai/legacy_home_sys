// src/repositories/prisma/prisma-contract-repository.ts

import { prisma } from '@/lib/prisma';
import { Contract, Prisma } from '@prisma/client';
import { ContractRepository } from '../contract-repository';

export class PrismaContractRepository implements ContractRepository {
  async create(data: Prisma.ContractCreateInput): Promise<Contract> {
    return await prisma.contract.create({ data });
  }

  async findById(contractId: string): Promise<Contract | null> {
    return await prisma.contract.findUnique({ where: { id: contractId } });
  }

  // Outros métodos relacionados a contratos
}
