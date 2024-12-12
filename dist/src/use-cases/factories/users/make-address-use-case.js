"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddAddressUseCase = makeAddAddressUseCase;
const prisma_address_repository_1 = require("@/repositories/prisma/prisma-address-repository");
const user_address_use_case_1 = require("@/use-cases/users/user-address-use-case");
function makeAddAddressUseCase() {
    const addressRepository = new prisma_address_repository_1.PrismaAddressRepository();
    return new user_address_use_case_1.AddAddressUseCase(addressRepository);
}
