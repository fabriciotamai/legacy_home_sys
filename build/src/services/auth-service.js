var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateToken, verifyToken } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.hash(password, 10);
        });
    }
    comparePasswords(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compare(password, hashedPassword);
        });
    }
    generateToken(payload, tokenVersion) {
        return generateToken(Object.assign(Object.assign({}, payload), { tokenVersion }));
    }
    validateToken(token) {
        try {
            const payload = verifyToken(token);
            if (!payload) {
                throw new Error('Payload inválido ou ausente no token.');
            }
            return payload;
        }
        catch (error) {
            throw new Error('Token inválido ou expirado.');
        }
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findById(userId);
        });
    }
    isTokenVersionValid(tokenVersion, currentVersion) {
        return tokenVersion === currentVersion;
    }
}
