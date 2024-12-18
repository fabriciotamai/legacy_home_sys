var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { seedPhasesAndTasks } from '../prisma/seed';
import { app } from './app';
import { env } from './env';
const iniciarServidor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = env.PORT || 3000;
        console.log('Iniciando verificação de seed...');
        yield seedPhasesAndTasks();
        console.log(`Iniciando servidor na porta ${port}...`);
        yield app.listen({ port, host: '0.0.0.0' });
        console.log(`Servidor rodando na porta ${port}`);
    }
    catch (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
});
void iniciarServidor();
