import { UsersRepository } from '@/repositories/user-repository';
interface LoginInput {
    email: string;
    password: string;
}
interface LoginOutput {
    token: string;
    mustChangePassword: boolean;
    user: {
        id: number;
        email: string;
        username: string;
        role: string;
    };
}
export declare class SigninUsers {
    private readonly userRepository;
    constructor(userRepository: UsersRepository);
    execute(input: LoginInput): Promise<LoginOutput>;
}
export {};
//# sourceMappingURL=signin-users.d.ts.map