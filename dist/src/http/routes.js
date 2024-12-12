"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = appRoutes;
const admin_register_users_handler_1 = require("@/http/controllers/admin/admin-register-users-handler");
const manage_compliance_handler_1 = require("@/http/controllers/admin/manage-compliance-handler");
const add_address_handler_1 = require("@/http/controllers/users/add-address-handler");
const change_password_handler_1 = require("@/http/controllers/users/change-password-handler");
const send_document_handler_1 = require("@/http/controllers/users/send-document-handler");
const user_sigin_handler_1 = require("@/http/controllers/users/user-sigin-handler");
const auth_middleware_1 = require("@/middlewares/auth/auth-middleware");
const role_middleware_1 = require("@/middlewares/auth/role-middleware");
const accept_or_reject_handler_1 = require("./controllers/admin/accept-or-reject-handler");
const create_enterprise_handler_1 = require("./controllers/admin/create-enterprise-handler");
const get_all_enterprise_handler_1 = require("./controllers/admin/get-all-enterprise-handler");
const get_all_users_handler_1 = require("./controllers/admin/get-all-users-handler");
const get_interest_with_enterprise_handler_1 = require("./controllers/admin/get-interest-with-enterprise-handler");
const get_phases_handler_1 = require("./controllers/admin/get-phases-handler");
const link_enteprise_to_user_handler_1 = require("./controllers/admin/link-enteprise-to-user-handler");
const get_user_enterprise_handler_1 = require("./controllers/users/get-user-enterprise-handler");
const interest_enterprise_handler_1 = require("./controllers/users/interest-enterprise-handler");
function appRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.register((publicRoutes) => __awaiter(this, void 0, void 0, function* () {
            publicRoutes.post('/admin/register', admin_register_users_handler_1.adminRegisterUsersHandler);
            publicRoutes.post('/users/signin', user_sigin_handler_1.userSiginHandler);
        }));
        app.register((protectedRoutes) => __awaiter(this, void 0, void 0, function* () {
            protectedRoutes.addHook('preHandler', auth_middleware_1.authMiddleware);
            protectedRoutes.put('/admin/:userId/compliance', { preHandler: role_middleware_1.roleMiddleware, }, manage_compliance_handler_1.manageComplianceHandler);
            protectedRoutes.get('/admin/phases', get_phases_handler_1.getPhasesHandler);
            protectedRoutes.post('/admin/create-enterprise', { preHandler: role_middleware_1.roleMiddleware, }, create_enterprise_handler_1.createEnterpriseHandler);
            protectedRoutes.get('/admin/get-enterprise', { preHandler: role_middleware_1.roleMiddleware, }, get_all_enterprise_handler_1.getAllEnterprisesHandler);
            protectedRoutes.post('/admin/link-enterprise', { preHandler: role_middleware_1.roleMiddleware, }, link_enteprise_to_user_handler_1.linkEnterpriseToUserHandler);
            protectedRoutes.get('/admin/get-all-users', { preHandler: role_middleware_1.roleMiddleware, }, get_all_users_handler_1.getAllUsersHandler);
            protectedRoutes.get('/admin/get-interest-enterprise', { preHandler: role_middleware_1.roleMiddleware, }, get_interest_with_enterprise_handler_1.getEnterprisesWithInterestsHandler);
            protectedRoutes.post('/admin/accept-or-reject-enterprise', { preHandler: role_middleware_1.roleMiddleware, }, accept_or_reject_handler_1.acceptOrRejectInterestHandler);
            // ------------------------------- USERS-------------------------------------------------------
            protectedRoutes.post('/users/change-password', change_password_handler_1.changePasswordHandler);
            protectedRoutes.post('/users/add-address', add_address_handler_1.addAddressHandler);
            protectedRoutes.post('/users/send-document', send_document_handler_1.sendDocumentsHandler);
            protectedRoutes.get('/users/my-enterprise', get_user_enterprise_handler_1.getUserEnterprisesHandler);
            protectedRoutes.post('/users/interest-enterprise', interest_enterprise_handler_1.interestEnterpriseHandler);
        }));
    });
}
