var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateToken } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
export class SigninUsers {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = input;
            const user = yield this.userRepository.findByEmail(email);
            if (!user || !(yield bcrypt.compare(password, user.password))) {
                throw {
                    status: 401,
                    message: 'E-mail ou senha estão incorretos.',
                };
            }
            const updatedUser = yield this.userRepository.updateUser(user.id, {
                tokenVersion: user.tokenVersion + 1,
            });
            const token = generateToken({
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                tokenVersion: updatedUser.tokenVersion,
            });
            return {
                token,
                mustChangePassword: updatedUser.mustChangePassword,
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    username: updatedUser.username,
                    role: updatedUser.role,
                    complianceStatus: user.complianceStatus,
                },
            };
        });
    }
}
