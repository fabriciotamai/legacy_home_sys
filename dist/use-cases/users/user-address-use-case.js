var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class AddAddressUseCase {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, street, number, complement, neighborhood, city, state, postalCode, country } = input;
            const existingAddresses = yield this.addressRepository.findByUserId(userId);
            if (existingAddresses.length > 0) {
                throw new Error('Usuário já possui um endereço cadastrado.');
            }
            // Cria o endereço associado ao usuário
            yield this.addressRepository.create({
                user: { connect: { id: userId } },
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                postalCode,
                country,
            });
            yield this.addressRepository.updateUserComplianceStatus(userId, 'PENDING_DOCUMENTS');
        });
    }
}
