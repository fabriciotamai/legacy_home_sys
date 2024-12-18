import { appRoutes } from '@/http/routes';
import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
export const app = fastify({ logger: true });
app.register(fastifyMultipart, {
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});
app.register(appRoutes);
