import { seedPhasesAndTasks } from '../prisma/seed';
import { app } from './app';
import { env } from './env';

import dotenv from 'dotenv';

dotenv.config();

const iniciarServidor = async () => {
  try {
    const port = env.PORT || 3000;

    console.log('🔹 Verificando e rodando seed...');
    try {
      await seedPhasesAndTasks();
      console.log('✅ Seed concluído.');
    } catch (seedError) {
      console.warn('⚠️ Aviso: Falha ao executar seed:', seedError);
    }

    console.log(`🚀 Iniciando servidor na porta ${port}...`);
    await app.listen({ port, host: '0.0.0.0' });

    console.log(`✅ Servidor rodando na porta ${port}`);
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err);

  
    if ((err as any).code === 'EADDRINUSE') {
      console.error(`🚨 Porta ${env.PORT} já está em uso. Escolha outra porta.`);
    }

    process.exit(1);
  }
};

void iniciarServidor();


