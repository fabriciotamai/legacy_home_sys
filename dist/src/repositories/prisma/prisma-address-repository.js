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
exports.PrismaAddressRepository = void 0;
const prisma_1 = require("../../lib/prisma");
class PrismaAddressRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.address.create({ data });
        });
    }
    findById(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.address.findUnique({
                where: { id: addressId },
            });
        });
    }
    updateUserComplianceStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.user.update({
                where: { id: userId },
                data: { complianceStatus: status },
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.address.findMany({
                where: { userId },
            });
        });
    }
    update(addressId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.address.update({
                where: { id: addressId },
                data,
            });
        });
    }
    delete(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.address.delete({
                where: { id: addressId },
            });
        });
    }
}
exports.PrismaAddressRepository = PrismaAddressRepository;
