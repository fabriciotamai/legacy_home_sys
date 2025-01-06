// src/serverless.ts
import { seedPhasesAndTasks } from '../prisma/seed';
import { app } from './app';

let seeded = false;
async function init() {
  if (!seeded) {
    console.log('Rodando seeds...');
    await seedPhasesAndTasks();
    seeded = true;
  }
}

// Export default para o Vercel
export default async function handler(req: any, res: any) {
  await init();
  await app.ready();
  app.server.emit('request', req, res);
}
