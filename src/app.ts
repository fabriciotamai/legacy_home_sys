import { appRoutes } from '@/http/routes';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import path from 'path';


export const app = fastify({
  logger: true,
  bodyLimit: 100 * 1024 * 1024, 
  connectionTimeout: 300000, 
  keepAliveTimeout: 300000, 
});


app.register(fastifyCors, {
  origin: '*', 
  credentials: true,
});


app.register(fastifyMultipart, {
  limits: { fileSize: 100 * 1024 * 1024 }, 
});


app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/static/',
});


app.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
  decorateReply: false,
});


app.register(appRoutes);


app.setErrorHandler((error, request, reply) => {
  console.error('❌ Erro Global:', {
    message: error.message,
    stack: error.stack,
    route: request.url,
    method: request.method,
  });

  reply.status(error.statusCode || 500).send({
    message: 'Erro interno do servidor.',
    details: error.message,
  });
});
