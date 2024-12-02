import { adminRegisterUsersHandler } from '@/http/controllers/admin/admin-register-users-handler';
import { authMiddleware } from '@/middlewares/auth/auth-middleware';
import { FastifyInstance } from 'fastify';
import { userSiginHandler } from './controllers/users/user-sigin-handler';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  
  app.register(async (publicRoutes) => {
    publicRoutes.post('/admin/register', adminRegisterUsersHandler);
    publicRoutes.post('/users/signin', userSiginHandler);
  });

  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authMiddleware);
  });
}
