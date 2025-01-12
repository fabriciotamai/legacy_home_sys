import { adminRegisterUsersHandler } from '@/http/controllers/admin/admin-register-users-handler';
import { manageComplianceHandler } from '@/http/controllers/admin/manage-compliance-handler';
import { addAddressHandler } from '@/http/controllers/users/add-address-handler';
import { changePasswordHandler } from '@/http/controllers/users/change-password-handler';
import { sendDocumentsHandler } from '@/http/controllers/users/send-document-handler';
import { userSiginHandler } from '@/http/controllers/users/user-sigin-handler';
import { authMiddleware } from '@/middlewares/auth/auth-middleware';
import { roleMiddleware } from '@/middlewares/auth/role-middleware';
import { FastifyInstance } from 'fastify';
import { acceptOrRejectComplianceHandler } from './controllers/admin/accept-or-reject-compliance-handler';
import { acceptOrRejectInterestHandler } from './controllers/admin/accept-or-reject-enterprise-handler';
import { adminAddAddressHandler } from './controllers/admin/admin-add-address-handler';
import { adminApproveOrRejectDepositHandler } from './controllers/admin/admin-approve-or-reject-deposit-handler';
import { adminDeleteEnterpriseHandler } from './controllers/admin/admin-delete-enterprise-handler';
import { adminDeleteFaqCategoryHandler } from './controllers/admin/admin-delete-faq-category-handler';
import { adminDeleteFaqHandler } from './controllers/admin/admin-delete-faq-handler';
import { adminDeleteEnterpriseImagesHandler } from './controllers/admin/admin-delete-images-enterprise-handler';
import { adminDeleteUserHandler } from './controllers/admin/admin-delete-user-handler';
import { adminListFaqCategoriesHandler } from './controllers/admin/admin-list-faq-categories-handler';
import { adminUpdateUserHandler } from './controllers/admin/admin-update-data-user-handler';
import { adminCreateFaqCategoryHandler } from './controllers/admin/create-category-faq-handler';
import { createEnterpriseHandler } from './controllers/admin/create-enterprise-handler';
import { adminCreateFaqHandler } from './controllers/admin/create-faq-handler';
import { getAdminDashboardHandler } from './controllers/admin/get-admin-dashboard-handler';
import { getAllEnterprisesHandler } from './controllers/admin/get-all-enterprise-handler';
import { getAllUsersHandler } from './controllers/admin/get-all-users-handler';
import { getEnterpriseImageUrlsHandler } from './controllers/admin/get-enteprise-images-url-handler';
import { getEnterprisesWithInterestsHandler } from './controllers/admin/get-interest-with-enterprise-handler';
import { getPhasesHandler } from './controllers/admin/get-phases-handler';
import { linkEnterpriseToUserHandler } from './controllers/admin/link-enteprise-to-user-handler';
import { adminListDepositsHandler } from './controllers/admin/list-deposit-handler';
import { adminListFaqsHandler } from './controllers/admin/list-faq-handler';
import { adminUpdateEnterpriseHandler } from './controllers/admin/update-enterprise-handler';
import { updateTaskStatusHandler } from './controllers/admin/update-progress-tasks-handler';
import { updateEnterpriseValuationHandler } from './controllers/admin/update-valution-enterprise-handler';
import { updateWalletBalanceHandler } from './controllers/admin/update-wallet-balance-handler';
import { buyEntepriseHandler } from './controllers/users/buy-enterprise-handler';
import { generateEmailCodeHandler } from './controllers/users/generate-token-email-handler';
import { getAllDepositsHandler } from './controllers/users/get-all-deposits-handler';
import { getDashboardDataHandler } from './controllers/users/get-dashboard-handler';
import { getEnterprisesAvailableHandler } from './controllers/users/get-enterprise-available-handler';
import { getUserEnterprisesHandler } from './controllers/users/get-user-enterprise-handler';
import { getUserWithAddressHandler } from './controllers/users/get-user-with-address-handler';
import { interestEnterpriseHandler } from './controllers/users/interest-enterprise-handler';
import { sendOrUpdateProofHandler } from './controllers/users/send-or-update-proof-handler';
import { updateUserAvatarHandler } from './controllers/users/update-avatar-handler';
import { updateUserHandler } from './controllers/users/update-user-profile.handler';
import { createDepositHandler } from './controllers/users/user-create-deposit-handler';
import { userRegisterHandler } from './controllers/users/user-register-use-handler';
import { validateEmailHandler } from './controllers/users/validate-email-handler';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  app.register(async (publicRoutes) => {
    publicRoutes.post('/admin/register', adminRegisterUsersHandler);
    publicRoutes.post('/users/signin', userSiginHandler);
    publicRoutes.post('/users/register', userRegisterHandler);
    publicRoutes.get(
      '/admin/enterprise/images/:enterpriseId',

      getEnterpriseImageUrlsHandler
    );
  });

  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authMiddleware);
    protectedRoutes.put('/admin/:userId/compliance', { preHandler: roleMiddleware }, manageComplianceHandler);
    protectedRoutes.get('/admin/phases', getPhasesHandler);
    protectedRoutes.post('/admin/create-enterprise', { preHandler: roleMiddleware }, createEnterpriseHandler);
    protectedRoutes.get('/admin/get-enterprise', { preHandler: roleMiddleware }, getAllEnterprisesHandler);
    protectedRoutes.delete('/admin/delete/images-enterprise/:enterpriseId', { preHandler: roleMiddleware }, adminDeleteEnterpriseImagesHandler);
    protectedRoutes.post('/admin/link-enterprise', { preHandler: roleMiddleware }, linkEnterpriseToUserHandler);
    protectedRoutes.post('/admin/deposit/approve-or-reject', { preHandler: roleMiddleware }, adminApproveOrRejectDepositHandler);
    protectedRoutes.put('/admin/update/:enterpriseId/valuation', { preHandler: roleMiddleware }, updateEnterpriseValuationHandler);
    protectedRoutes.get('/admin/get-all-users', { preHandler: roleMiddleware }, getAllUsersHandler);
    protectedRoutes.put('/admin/updatecompliance/:userId', { preHandler: roleMiddleware }, acceptOrRejectComplianceHandler);
    protectedRoutes.put('/admin/update/balance/:userId', { preHandler: roleMiddleware }, updateWalletBalanceHandler);
    protectedRoutes.put('/admin/update/user/:id', { preHandler: roleMiddleware }, adminUpdateUserHandler);
    protectedRoutes.get('/admin/get-interest-enterprise', { preHandler: roleMiddleware }, 
      getEnterprisesWithInterestsHandler);
    protectedRoutes.post('/admin/accept-or-reject-enterprise', { preHandler: roleMiddleware }, acceptOrRejectInterestHandler);
    protectedRoutes.post('/admin/update-progress-task', { preHandler: roleMiddleware }, updateTaskStatusHandler);
    protectedRoutes.post('/admin/faq/create-category', { preHandler: roleMiddleware }, adminCreateFaqCategoryHandler);
    protectedRoutes.post('/admin/faq/create', { preHandler: roleMiddleware }, adminCreateFaqHandler);
    protectedRoutes.get('/admin/faq/list', { preHandler: roleMiddleware }, adminListFaqsHandler);
    protectedRoutes.get('/admin/faq/categories', { preHandler: roleMiddleware }, adminListFaqCategoriesHandler);
    protectedRoutes.delete('/admin/faq/category/:categoryId', { preHandler: roleMiddleware }, adminDeleteFaqCategoryHandler);
    protectedRoutes.put('/admin/update/enterprise/:enterpriseId', { preHandler: roleMiddleware }, adminUpdateEnterpriseHandler);
    protectedRoutes.delete('/admin/faq/:faqId', { preHandler: roleMiddleware }, adminDeleteFaqHandler);
    protectedRoutes.delete('/admin/enterprise/:enterpriseId', { preHandler: roleMiddleware }, adminDeleteEnterpriseHandler);
    protectedRoutes.delete('/admin/user/:userId/delete', { preHandler: roleMiddleware }, adminDeleteUserHandler);
   

    protectedRoutes.post('/admin/users/:id/address', { preHandler: roleMiddleware }, adminAddAddressHandler);
    protectedRoutes.get('/admin/dashboard', { preHandler: roleMiddleware }, getAdminDashboardHandler);
    protectedRoutes.get('/admin/deposits', adminListDepositsHandler);
    // ------------------------------- USERS-------------------------------------------------------
    protectedRoutes.post('/users/change-password', changePasswordHandler);
    protectedRoutes.post('/users/add-address', addAddressHandler);
    protectedRoutes.post('/users/send-document', sendDocumentsHandler);
    protectedRoutes.post('/users/address', addAddressHandler);
    protectedRoutes.post('/users/validate-email', validateEmailHandler);
    protectedRoutes.post('/users/buy-enterprise', buyEntepriseHandler);
    protectedRoutes.get('/users/my-enterprise', getUserEnterprisesHandler);
    protectedRoutes.get('/users/me/data', getUserWithAddressHandler);
    protectedRoutes.post('/users/interest-enterprise', interestEnterpriseHandler);
    protectedRoutes.get('/users/enterprise/available', getEnterprisesAvailableHandler);
    protectedRoutes.get('/users/geratetoken', generateEmailCodeHandler);
    protectedRoutes.get('/users/dashboard', getDashboardDataHandler);
    protectedRoutes.post('/users/deposit', createDepositHandler);
    protectedRoutes.get('/users/getalldeposit', getAllDepositsHandler);
    protectedRoutes.post('/users/proof-payment', sendOrUpdateProofHandler);
    protectedRoutes.post('/users/update/profile', updateUserHandler);
    protectedRoutes.post('/users/update/avatar', updateUserAvatarHandler);
  });
}
