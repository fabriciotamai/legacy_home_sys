var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class GetAllEnterprisesUseCase {
    constructor(enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }
    execute(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, investmentType, isAvailable } = filters;
            const queryFilters = {
                status: status || undefined,
                investmentType: investmentType || undefined,
                isAvailable: isAvailable !== undefined ? isAvailable : undefined,
            };
            return this.enterpriseRepository.findAll(queryFilters);
        });
    }
}
