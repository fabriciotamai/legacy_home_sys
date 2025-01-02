import { appRoutes } from '@/http/routes';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
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

app.register(fastifyCors, {
  origin: (origin, cb) => {
    const allowedOrigins = ['http://localhost:3000'];

    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Não permitido por CORS'), false);
    }
  },
  credentials: true,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/static/',
});

app.register(appRoutes);
