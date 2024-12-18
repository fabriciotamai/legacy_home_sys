var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SendDocumentsUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, documentType, documentFront, documentBack, proofOfAddress, incomeTaxProof } = input;
            const user = yield this.usersRepository.findById(userId);
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }
            yield this.usersRepository.updateUser(userId, {
                documentType,
                documentFront,
                documentBack,
                proofOfAddress,
                incomeTaxProof,
                complianceStatus: 'UNDER_REVIEW',
            });
        });
    }
}
