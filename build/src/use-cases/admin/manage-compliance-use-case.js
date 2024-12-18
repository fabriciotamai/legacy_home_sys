var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ManageComplianceUseCase {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, action, reason } = input;
            const user = yield this.adminRepository.findById(userId);
            if (!user) {
                throw new Error(`Usuário não encontrado. ID: ${userId}`);
            }
            this.validateAction(user, action, reason);
            const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
            yield this.adminRepository.updateUser(userId, Object.assign({ complianceStatus: newStatus }, (action === 'reject' ? { rejectionReason: reason } : {})));
            return {
                userId,
                previousStatus: user.complianceStatus,
                newStatus,
                reason: action === 'reject' ? reason : undefined,
            };
        });
    }
    validateAction(user, action, reason) {
        if (user.complianceStatus !== 'UNDER_REVIEW') {
            throw new Error(`Ação inválida. O status atual do compliance é ${user.complianceStatus}. Só é possível ${action} usuários em revisão.`);
        }
        if (action === 'reject' && !reason) {
            throw new Error('Motivo é obrigatório para rejeição.');
        }
    }
}
