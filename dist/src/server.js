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
const seed_1 = require("../prisma/seed");
const app_1 = require("./app");
const env_1 = require("./env");
const iniciarServidor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = env_1.env.PORT || 3000;
        console.log('Iniciando verificação de seed...');
        yield (0, seed_1.seedPhasesIfNeeded)();
        console.log(`Iniciando servidor na porta ${port}...`);
        yield app_1.app.listen({ port, host: '0.0.0.0' });
        console.log(`Servidor rodando na porta ${port}`);
    }
    catch (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
});
void iniciarServidor();
