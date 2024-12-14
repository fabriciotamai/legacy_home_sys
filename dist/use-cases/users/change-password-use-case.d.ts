import { UsersRepository } from '@/repositories/user-repository';
interface ChangePasswordInput {
    userId: number;
    currentPassword: string;
    newPassword: string;
}
export declare class ChangePasswordUseCase {
    private readonly userRepository;
    constructor(userRepository: UsersRepository);
    execute(input: ChangePasswordInput): Promise<void>;
}
export {};
//# sourceMappingURL=change-password-use-case.d.ts.map