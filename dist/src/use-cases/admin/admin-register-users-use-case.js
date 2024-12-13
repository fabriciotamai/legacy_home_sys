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
exports.AdminRegisterUsersUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AdminRegisterUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, password, firstName, lastName, birthDate, userType, numberDocument, phone, role, } = input;
            if (!email || !username || !password || !firstName || !lastName || !userType || !role) {
                throw new Error('Campos obrigatórios estão faltando.');
            }
            const existingUserByEmail = yield this.userRepository.findByEmail(email);
            if (existingUserByEmail) {
                throw new Error('E-mail já está em uso.');
            }
            const existingUserByUsername = yield this.userRepository.findByUsername(username);
            if (existingUserByUsername) {
                throw new Error('Nome de usuário já está em uso.');
            }
            if (numberDocument) {
                const existingUserByDocument = yield this.userRepository.findByDocument(numberDocument);
                if (existingUserByDocument) {
                    throw new Error('Número de documento já está em uso.');
                }
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const parsedBirthDate = birthDate ? new Date(birthDate) : undefined;
            yield this.userRepository.create({
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                birthDate: parsedBirthDate,
                userType,
                numberDocument,
                phone,
                role,
                isApproved: false,
                complianceStatus: 'PENDING_ADDRESS',
            });
        });
    }
}
exports.AdminRegisterUsersUseCase = AdminRegisterUsersUseCase;
