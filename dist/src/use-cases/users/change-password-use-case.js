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
exports.ChangePasswordUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ChangePasswordUseCase {
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
            const isCurrentPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('A senha atual está incorreta.');
            }
            const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this.userRepository.updatePassword(userId, hashedNewPassword);
            if (user.mustChangePassword) {
                yield this.userRepository.updateUser(userId, { mustChangePassword: false });
            }
        });
    }
}
exports.ChangePasswordUseCase = ChangePasswordUseCase;
