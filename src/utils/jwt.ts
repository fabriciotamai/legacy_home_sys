import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function generateToken(payload: object, tokenVersion: number): string {
  return jwt.sign({ ...payload, tokenVersion }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as JwtPayload;
    }

    return null;
  } catch (error) {
    return null; 
  }
}


export function isTokenVersionValid(tokenVersion: number, currentVersion: number): boolean {
  return tokenVersion === currentVersion;
}
