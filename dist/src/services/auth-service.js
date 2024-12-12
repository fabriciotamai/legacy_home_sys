"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_1 = require("@/utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.hash(password, 10);
        });
    }
    comparePasswords(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(password, hashedPassword);
        });
    }
    generateToken(payload, tokenVersion) {
        return (0, jwt_1.generateToken)(Object.assign(Object.assign({}, payload), { tokenVersion }));
    }
    validateToken(token) {
        try {
            const payload = (0, jwt_1.verifyToken)(token);
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
exports.AuthService = AuthService;
