import { AdminRepository } from '@/repositories/admin-repository';
import { Role, UserType } from '@prisma/client';
interface RegisterUserInput {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    userType: UserType;
    numberDocument?: string;
    phone?: string;
    role: Role;
}
export declare class AdminRegisterUsersUseCase {
    private readonly userRepository;
    constructor(userRepository: AdminRepository);
    execute(input: RegisterUserInput): Promise<void>;
}
export {};
//# sourceMappingURL=admin-register-users-use-case.d.ts.map