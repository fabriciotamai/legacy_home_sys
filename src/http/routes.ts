import { adminRegisterUsersHandler } from '@/http/controllers/admin/admin-register-users-handler';
import { manageComplianceHandler } from '@/http/controllers/admin/manage-compliance-handler';
import { addAddressHandler } from '@/http/controllers/users/add-address-handler';
import { changePasswordHandler } from '@/http/controllers/users/change-password-handler';
import { sendDocumentsHandler } from '@/http/controllers/users/send-document-handler';
import { userSiginHandler } from '@/http/controllers/users/user-sigin-handler';
import { authMiddleware } from '@/middlewares/auth/auth-middleware';
import { roleMiddleware } from '@/middlewares/auth/role-middleware';
import { FastifyInstance } from 'fastify';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  app.register(async (publicRoutes) => {
    publicRoutes.post('/admin/register', adminRegisterUsersHandler);
    publicRoutes.post('/users/signin', userSiginHandler);
  });

  app.register(
    async (protectedRoutes) => {
      protectedRoutes.addHook('preHandler', authMiddleware); 
      protectedRoutes.post('/users/change-password', changePasswordHandler);
      protectedRoutes.post('/users/add-address', addAddressHandler);
      protectedRoutes.post('/users/send-document', sendDocumentsHandler);
      protectedRoutes.put('/admin/:userId/compliance',{ preHandler: roleMiddleware,},manageComplianceHandler );
    },
  );
}
