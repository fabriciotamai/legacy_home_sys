import { UsersRepository } from '@/repositories/user-repository';
interface SendDocumentsInput {
    userId: number;
    documentType: 'RG' | 'CNH' | 'PASSPORT';
    documentFront: string;
    documentBack?: string;
    proofOfAddress: string;
    incomeTaxProof: string;
}
export declare class SendDocumentsUseCase {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    execute(input: SendDocumentsInput): Promise<void>;
}
export {};
//# sourceMappingURL=send-document-use-case.d.ts.map