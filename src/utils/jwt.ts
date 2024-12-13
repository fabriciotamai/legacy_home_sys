import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
  tokenVersion: number;
}


export function generateToken(payload: CustomJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}


export function verifyToken(token: string): CustomJwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'object' && decoded !== null) {
      const { id, email, role, tokenVersion } = decoded as CustomJwtPayload;

      // Validar campos obrigatórios no payload
      if (!id || !email || !role || tokenVersion === undefined) {
        throw new Error('Payload inválido no token.');
      }

      return decoded as CustomJwtPayload;
    }

    throw new Error('Token inválido.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Erro ao validar o token: ' + error.message);
    }
    throw new Error('Erro desconhecido ao validar o token.');
  }
}


export function isTokenVersionValid(tokenVersion: number, currentVersion: number): boolean {
  return tokenVersion === currentVersion;
}
