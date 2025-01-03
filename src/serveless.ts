import { seedPhasesAndTasks } from '../prisma/seed';
import { app } from './app';

let seedDone = false;
async function init() {
  if (!seedDone) {
    await seedPhasesAndTasks();
    seedDone = true;
  }
}

export default async function handler(req: any, res: any) {
  await init();

  await app.ready();

  app.server.emit('request', req, res);
}
