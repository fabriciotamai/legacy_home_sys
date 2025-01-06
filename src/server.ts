// src/server.ts
import { seedPhasesAndTasks } from '../prisma/seed';
import { app } from './app';
import { env } from './env';

const iniciarServidor = async () => {
  try {
    const port = env.PORT || 3000;

    console.log('Iniciando verificação de seed...');
    await seedPhasesAndTasks();

    console.log(`Iniciando servidor na porta ${port}...`);
    await app.listen({ port, host: '0.0.0.0' });

    console.log(`Servidor rodando na porta ${port}`);
  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
};

void iniciarServidor();
