import { appRoutes } from '@/http/routes';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = fastify({ logger: true });

app.register(fastifyMultipart, {
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/static/',
});

app.register(appRoutes);
