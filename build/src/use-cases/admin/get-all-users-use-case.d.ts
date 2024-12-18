import { AdminRepository } from '@/repositories/admin-repository';
import { User } from '@prisma/client';
export declare class GetAllUsersUseCase {
    private readonly adminRepository;
    constructor(adminRepository: AdminRepository);
    execute(): Promise<User[]>;
}
//# sourceMappingURL=get-all-users-use-case.d.ts.map