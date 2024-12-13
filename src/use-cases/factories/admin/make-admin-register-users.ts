import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { AdminRegisterUsersUseCase } from '../../admin/admin-register-users-use-case';

export function makeAdminRegisterUsers(): AdminRegisterUsersUseCase {
  const adminRepository = new PrismaAdminRepository(); 
  return new AdminRegisterUsersUseCase(adminRepository); 
}
