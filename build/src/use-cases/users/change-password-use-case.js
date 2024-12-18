var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcryptjs';
export class ChangePasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, currentPassword, newPassword } = input;
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
            const isCurrentPasswordValid = yield bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('A senha atual está incorreta.');
            }
            const hashedNewPassword = yield bcrypt.hash(newPassword, 10);
            yield this.userRepository.updatePassword(userId, hashedNewPassword);
            if (user.mustChangePassword) {
                yield this.userRepository.updateUser(userId, {
                    mustChangePassword: false,
                });
            }
        });
    }
}
