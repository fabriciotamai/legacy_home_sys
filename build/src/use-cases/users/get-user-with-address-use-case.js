var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class GetUserWithAddressUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const user = yield this.usersRepository.findUserWithAddress(userId);
            if (!user) {
                throw new Error('User not found.');
            }
            return {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                numberDocument: (_a = user.numberDocument) !== null && _a !== void 0 ? _a : null,
                birthDate: (_c = (_b = user.birthDate) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : null,
                userType: user.userType,
                phone: (_d = user.phone) !== null && _d !== void 0 ? _d : null,
                documentFront: (_e = user.documentFront) !== null && _e !== void 0 ? _e : null,
                documentBack: (_f = user.documentBack) !== null && _f !== void 0 ? _f : null,
                incomeTaxProof: (_g = user.incomeTaxProof) !== null && _g !== void 0 ? _g : null,
                proofOfAddress: (_h = user.proofOfAddress) !== null && _h !== void 0 ? _h : null,
                complianceStatus: user.complianceStatus,
                addresses: user.addresses.map((address) => {
                    var _a;
                    return ({
                        id: address.id,
                        street: address.street,
                        number: address.number,
                        complement: (_a = address.complement) !== null && _a !== void 0 ? _a : undefined,
                        neighborhood: address.neighborhood,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country,
                    });
                }),
            };
        });
    }
}
