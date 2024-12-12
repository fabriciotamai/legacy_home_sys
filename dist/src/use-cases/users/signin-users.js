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
exports.SigninUsers = void 0;
const jwt_1 = require("@/utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class SigninUsers {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = input;
            // Busca o usuário pelo email
            const user = yield this.userRepository.findByEmail(email);
            // Verifica se o usuário existe e se a senha é válida
            if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
                throw {
                    status: 401,
                    message: 'E-mail ou senha estão incorretos.', // Mensagem clara e específica
                };
            }
            // Incrementa a versão do token no banco de dados
            const updatedUser = yield this.userRepository.updateUser(user.id, {
                tokenVersion: user.tokenVersion + 1,
            });
            // Gera o token com a nova versão do token
            const token = (0, jwt_1.generateToken)({
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                tokenVersion: updatedUser.tokenVersion,
            });
            // Retorna o token e os dados do usuário
            return {
                token,
                mustChangePassword: updatedUser.mustChangePassword,
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    username: updatedUser.username,
                    role: updatedUser.role,
                },
            };
        });
    }
}
exports.SigninUsers = SigninUsers;
