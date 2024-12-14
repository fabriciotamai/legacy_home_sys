import { Contract, Prisma } from '@prisma/client';
export interface ContractRepository {
    create(data: Prisma.ContractCreateInput): Promise<Contract>;
    findById(contractId: string): Promise<Contract | null>;
}
//# sourceMappingURL=contract-repository.d.ts.map