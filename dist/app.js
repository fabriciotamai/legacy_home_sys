import { appRoutes } from '@/http/routes';
import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
export const app = fastify({ logger: true });
app.register(fastifyMultipart);
app.register(appRoutes);
