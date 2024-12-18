var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '../../lib/prisma';
export class PrismaAddressRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.address.create({ data });
        });
    }
    findById(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.address.findUnique({
                where: { id: addressId },
            });
        });
    }
    findPhasesByEnterprise(enterpriseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.phase.findMany({
                where: {
                    enterprises: {
                        some: { id: enterpriseId },
                    },
                },
                include: {
                    tasks: true,
                },
            });
        });
    }
    updateUserComplianceStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.update({
                where: { id: userId },
                data: { complianceStatus: status },
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.address.findMany({
                where: { userId },
            });
        });
    }
    update(addressId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.address.update({
                where: { id: addressId },
                data,
            });
        });
    }
    delete(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.address.delete({
                where: { id: addressId },
            });
        });
    }
}
