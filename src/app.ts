import { appRoutes } from '@/http/routes';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import path from 'path';

export const app = fastify({ logger: true });

const corsOptions = {
  origin: true,
  credentials: true,
};

const multipartOptions = {
  limits: { fileSize: 100 * 1024 * 1024 },
};


app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'), 
  prefix: '/static/',
  serve: true,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
  decorateReply: false, 
});

app.register(fastifyCors, corsOptions);
app.register(fastifyMultipart, multipartOptions);
app.register(appRoutes);
