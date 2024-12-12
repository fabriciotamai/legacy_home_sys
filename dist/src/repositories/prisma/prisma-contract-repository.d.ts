import { Contract, Prisma } from '@prisma/client';
import { ContractRepository } from '../contract-repository';
export declare class PrismaContractRepository implements ContractRepository {
    create(data: Prisma.ContractCreateInput): Promise<Contract>;
    findById(contractId: string): Promise<Contract | null>;
}
//# sourceMappingURL=prisma-contract-repository.d.ts.map