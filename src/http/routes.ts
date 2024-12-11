import { adminRegisterUsersHandler } from '@/http/controllers/admin/admin-register-users-handler';
import { manageComplianceHandler } from '@/http/controllers/admin/manage-compliance-handler';
import { addAddressHandler } from '@/http/controllers/users/add-address-handler';
import { changePasswordHandler } from '@/http/controllers/users/change-password-handler';
import { sendDocumentsHandler } from '@/http/controllers/users/send-document-handler';
import { userSiginHandler } from '@/http/controllers/users/user-sigin-handler';
import { authMiddleware } from '@/middlewares/auth/auth-middleware';
import { roleMiddleware } from '@/middlewares/auth/role-middleware';
import { FastifyInstance } from 'fastify';
import { createEnterpriseHandler } from './controllers/admin/create-enterprise-handler';
import { getAllEnterprisesHandler } from './controllers/admin/get-all-enterprise-handler';
import { getAllUsersHandler } from './controllers/admin/get-all-users-handler';
import { getPhasesHandler } from './controllers/admin/get-phases-handler';
import { linkEnterpriseToUserHandler } from './controllers/admin/link-enteprise-to-user-handler';
import { getUserEnterprisesHandler } from './controllers/users/get-user-enterprise-handler';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  app.register(async (publicRoutes) => {
    publicRoutes.post('/admin/register', adminRegisterUsersHandler);
    publicRoutes.post('/users/signin', userSiginHandler);
  });

  app.register(
    async (protectedRoutes) => {
      protectedRoutes.addHook('preHandler', authMiddleware); 
      protectedRoutes.put('/admin/:userId/compliance',{ preHandler: roleMiddleware,},manageComplianceHandler );
      protectedRoutes.get('/admin/phases', getPhasesHandler); 
      protectedRoutes.post('/admin/create-enterprise',{ preHandler: roleMiddleware,}, createEnterpriseHandler); 
      protectedRoutes.get('/admin/get-enterprise',{ preHandler: roleMiddleware,}, getAllEnterprisesHandler); 
      protectedRoutes.post('/admin/link-enterprise',{ preHandler: roleMiddleware,}, linkEnterpriseToUserHandler); 
      protectedRoutes.get('/admin/get-all-users',{ preHandler: roleMiddleware,}, getAllUsersHandler);

      
      // ------------------------------- USERS-------------------------------------------------------
      protectedRoutes.post('/users/change-password', changePasswordHandler);
      protectedRoutes.post('/users/add-address', addAddressHandler);
      protectedRoutes.post('/users/send-document', sendDocumentsHandler);
      protectedRoutes.get('/users/my-enterprise', getUserEnterprisesHandler);
 
    },
  );
}
