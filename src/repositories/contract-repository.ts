import { Contract, ContractSignature, Prisma } from '@prisma/client';

export interface ContractRepository {
  create(data: Prisma.ContractCreateInput): Promise<Contract>;
  findById(contractId: string): Promise<Contract | null>;
  updateStatus(contractId: string, status: string): Promise<Contract>;
  setEnvelopeId(contractId: string, envelopeId: string): Promise<Contract>;
  createSignature(data: Prisma.ContractSignatureCreateInput): Promise<ContractSignature>;
}
