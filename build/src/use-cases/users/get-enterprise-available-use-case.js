var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { InterestStatus } from '@prisma/client';
export class GetEnterprisesAvailableUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    execute(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const enterprises = yield this.enterpriseRepository.findAll(filters);
            const filteredEnterprises = enterprises.filter((enterprise) => {
                var _a;
                return !((_a = enterprise.contractInterests) === null || _a === void 0 ? void 0 : _a.some((interest) => interest.status === InterestStatus.APPROVED));
            });
            return filteredEnterprises;
        });
    }
}
