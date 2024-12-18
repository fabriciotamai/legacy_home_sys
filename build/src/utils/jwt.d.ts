import { JwtPayload } from 'jsonwebtoken';
interface CustomJwtPayload extends JwtPayload {
    id: number;
    email: string;
    role: string;
    tokenVersion: number;
}
export declare function generateToken(payload: CustomJwtPayload): string;
export declare function verifyToken(token: string): CustomJwtPayload;
export declare function isTokenVersionValid(tokenVersion: number, currentVersion: number): boolean;
export {};
//# sourceMappingURL=jwt.d.ts.map