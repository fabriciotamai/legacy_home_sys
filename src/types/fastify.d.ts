import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload & {
      id: number;
      email: string;
      role: string;
      username: string;
      firstName: string;
      lastName: string;
      token: string;
      tokenVersion: number;
    };
  }
}
