import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository: PrismaUsersRepository);
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string, hashedPassword: string): Promise<boolean>;
    generateToken(payload: {
        id: number;
        email: string;
        role: string;
    }, tokenVersion: number): string;
    validateToken(token: string): JwtPayload;
    getUserById(userId: number): Promise<User | null>;
    isTokenVersionValid(tokenVersion: number, currentVersion: number): boolean;
}
//# sourceMappingURL=auth-service.d.ts.map