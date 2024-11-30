import { appRoutes } from '@/http/routes';
import { authMiddleware } from '@/middlewares/auth/auth-middleware';
import fastify from 'fastify';

export const app = fastify({ logger: true });


app.addHook('onRequest', authMiddleware);


app.register(appRoutes);
