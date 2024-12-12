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
exports.getAllUsersHandler = getAllUsersHandler;
const make_get_all_users_use_case_1 = require("@/use-cases/factories/admin/make-get-all-users-use-case");
function getAllUsersHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getAllUsersUseCase = (0, make_get_all_users_use_case_1.makeGetAllUsersUseCase)();
            const users = yield getAllUsersUseCase.execute();
            reply.status(200).send({
                message: 'Usuários recuperados com sucesso.',
                users,
            });
        }
        catch (error) {
            console.error('Erro ao buscar usuários:', error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : 'Erro inesperado.',
            });
        }
    });
}
