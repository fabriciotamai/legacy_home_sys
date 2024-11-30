import { adminRegisterUsersHandler } from '@/http/controllers/admin/admin-register-users-handler';
import { FastifyInstance } from 'fastify';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  // ------------------------ ADMIN ROUTES -----------------------------------------//
  app.post('/admin/register', adminRegisterUsersHandler);
}