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
exports.PrismaAdminRepository = void 0;
const prisma_1 = require("../../lib/prisma");
class PrismaAdminRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.create({ data });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findUnique({
                where: { email },
            });
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findUnique({
                where: { username },
            });
        });
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findMany({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
            });
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.update({
                where: { id: userId },
                data,
            });
        });
    }
    addAddress(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.address.create({
                data: Object.assign(Object.assign({}, data), { user: {
                        connect: {
                            id: userId,
                        },
                    } }),
            });
        });
    }
    findByDocument(numberDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findUnique({
                where: { numberDocument },
            });
        });
    }
}
exports.PrismaAdminRepository = PrismaAdminRepository;
