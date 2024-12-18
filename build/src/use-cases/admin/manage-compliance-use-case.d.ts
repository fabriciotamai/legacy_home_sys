import { AdminRepository } from '@/repositories/admin-repository';
interface ManageComplianceInput {
    userId: number;
    action: 'approve' | 'reject';
    reason?: string;
}
interface ManageComplianceOutput {
    userId: number;
    previousStatus: string;
    newStatus: string;
    reason?: string;
}
export declare class ManageComplianceUseCase {
    private readonly adminRepository;
    constructor(adminRepository: AdminRepository);
    execute(input: ManageComplianceInput): Promise<ManageComplianceOutput>;
    private validateAction;
}
export {};
//# sourceMappingURL=manage-compliance-use-case.d.ts.map