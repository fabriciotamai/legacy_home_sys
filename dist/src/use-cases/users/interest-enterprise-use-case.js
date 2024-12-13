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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestEnterpriseUseCase = void 0;
class InterestEnterpriseUseCase {
    constructor(usersRepository, enterpriseRepository) {
        this.usersRepository = usersRepository;
        this.enterpriseRepository = enterpriseRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, enterpriseId } = input;
            const user = yield this.usersRepository.findById(userId);
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
            const enterprise = yield this.enterpriseRepository.findById(enterpriseId);
            if (!enterprise) {
                throw new Error('Empreendimento não encontrado.');
            }
            const contractInterest = yield this.enterpriseRepository.linkUserToEnterprise(userId, enterpriseId);
            return contractInterest;
        });
    }
}
exports.InterestEnterpriseUseCase = InterestEnterpriseUseCase;
