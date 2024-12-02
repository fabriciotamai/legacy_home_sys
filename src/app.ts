import { appRoutes } from '@/http/routes';
import fastify from 'fastify';

export const app = fastify({ logger: true });





app.register(appRoutes);
