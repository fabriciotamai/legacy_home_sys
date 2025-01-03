import { appRoutes } from '@/http/routes';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = fastify({ logger: true });

const corsOptions = {
  origin: true,
  credentials: true,
};

const multipartOptions = {
  limits: { fileSize: 50 * 1024 * 1024 },
};

const staticOptions = {
  root: path.join(__dirname, '../public'),
  prefix: '/static/',
};

app.register(fastifyCors, corsOptions);
app.register(fastifyMultipart, multipartOptions);
app.register(fastifyStatic, staticOptions);

app.register(appRoutes);
