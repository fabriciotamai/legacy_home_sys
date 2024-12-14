var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { adminRegisterUsersHandler } from '@/http/controllers/admin/admin-register-users-handler';
import { manageComplianceHandler } from '@/http/controllers/admin/manage-compliance-handler';
import { addAddressHandler } from '@/http/controllers/users/add-address-handler';
import { changePasswordHandler } from '@/http/controllers/users/change-password-handler';
import { sendDocumentsHandler } from '@/http/controllers/users/send-document-handler';
import { userSiginHandler } from '@/http/controllers/users/user-sigin-handler';
import { authMiddleware } from '@/middlewares/auth/auth-middleware';
import { roleMiddleware } from '@/middlewares/auth/role-middleware';
import { acceptOrRejectInterestHandler } from './controllers/admin/accept-or-reject-handler';
import { createEnterpriseHandler } from './controllers/admin/create-enterprise-handler';
import { getAllEnterprisesHandler } from './controllers/admin/get-all-enterprise-handler';
import { getAllUsersHandler } from './controllers/admin/get-all-users-handler';
import { getEnterprisesWithInterestsHandler } from './controllers/admin/get-interest-with-enterprise-handler';
import { getPhasesHandler } from './controllers/admin/get-phases-handler';
import { linkEnterpriseToUserHandler } from './controllers/admin/link-enteprise-to-user-handler';
import { updateTaskStatusHandler } from './controllers/admin/update-progress-tasks-handler';
import { getUserEnterprisesHandler } from './controllers/users/get-user-enterprise-handler';
import { interestEnterpriseHandler } from './controllers/users/interest-enterprise-handler';
export function appRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.register((publicRoutes) => __awaiter(this, void 0, void 0, function* () {
            publicRoutes.post('/admin/register', adminRegisterUsersHandler);
            publicRoutes.post('/users/signin', userSiginHandler);
        }));
        app.register((protectedRoutes) => __awaiter(this, void 0, void 0, function* () {
            protectedRoutes.addHook('preHandler', authMiddleware);
            protectedRoutes.put('/admin/:userId/compliance', { preHandler: roleMiddleware }, manageComplianceHandler);
            protectedRoutes.get('/admin/phases', getPhasesHandler);
            protectedRoutes.post('/admin/create-enterprise', { preHandler: roleMiddleware }, createEnterpriseHandler);
            protectedRoutes.get('/admin/get-enterprise', { preHandler: roleMiddleware }, getAllEnterprisesHandler);
            protectedRoutes.post('/admin/link-enterprise', { preHandler: roleMiddleware }, linkEnterpriseToUserHandler);
            protectedRoutes.get('/admin/get-all-users', { preHandler: roleMiddleware }, getAllUsersHandler);
            protectedRoutes.get('/admin/get-interest-enterprise', { preHandler: roleMiddleware }, getEnterprisesWithInterestsHandler);
            protectedRoutes.post('/admin/accept-or-reject-enterprise', { preHandler: roleMiddleware }, acceptOrRejectInterestHandler);
            protectedRoutes.post('/admin/update-progress-task', { preHandler: roleMiddleware }, updateTaskStatusHandler);
            // ------------------------------- USERS-------------------------------------------------------
            protectedRoutes.post('/users/change-password', changePasswordHandler);
            protectedRoutes.post('/users/add-address', addAddressHandler);
            protectedRoutes.post('/users/send-document', sendDocumentsHandler);
            protectedRoutes.get('/users/my-enterprise', getUserEnterprisesHandler);
            protectedRoutes.post('/users/interest-enterprise', interestEnterpriseHandler);
        }));
    });
}
