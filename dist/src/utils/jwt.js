"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.isTokenVersionValid = isTokenVersionValid;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded !== null) {
            const { id, email, role, tokenVersion } = decoded;
            // Validar campos obrigatórios no payload
            if (!id || !email || !role || tokenVersion === undefined) {
                throw new Error('Payload inválido no token.');
            }
            return decoded;
        }
        throw new Error('Token inválido.');
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Erro ao validar o token: ' + error.message);
        }
        throw new Error('Erro desconhecido ao validar o token.');
    }
}
function isTokenVersionValid(tokenVersion, currentVersion) {
    return tokenVersion === currentVersion;
}
