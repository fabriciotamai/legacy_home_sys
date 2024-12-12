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
exports.AcceptOrRejectInterestUseCase = void 0;
class AcceptOrRejectInterestUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { interestId, status } = input;
            const interest = yield this.enterpriseRepository.findInterestById(interestId);
            if (!interest) {
                throw new Error('Interesse não encontrado.');
            }
            const updatedInterest = yield this.enterpriseRepository.updateInterestStatus(interestId, status);
            if (status === 'APPROVED') {
                yield this.enterpriseRepository.removeOtherInterests(interest.enterpriseId, interestId);
            }
            return updatedInterest;
        });
    }
}
exports.AcceptOrRejectInterestUseCase = AcceptOrRejectInterestUseCase;
