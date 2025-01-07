import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { generateToken, verifyToken } from '@/utils/jwt';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';

export class AuthService {
  constructor(private readonly userRepository: PrismaUsersRepository) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: { id: number; email: string; role: string }, tokenVersion: number): string {
    return generateToken({ ...payload, tokenVersion });
  }

  validateToken(token: string): JwtPayload {
    try {
      const payload = verifyToken(token);
      if (!payload) {
        throw new Error('Payload inválido ou ausente no token.');
      }
      return payload;
    } catch {
      throw new Error('Token inválido ou expirado.');
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  isTokenVersionValid(tokenVersion: number, currentVersion: number): boolean {
    return tokenVersion === currentVersion;
  }
}
