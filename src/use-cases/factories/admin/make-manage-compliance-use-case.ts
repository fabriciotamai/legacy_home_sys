import { PrismaAdminRepository } from '@/repositories/prisma/prisma-admin-repository';
import { ManageComplianceUseCase } from '@/use-cases/admin/manage-compliance-use-case';

export function makeManageComplianceUseCase(): ManageComplianceUseCase {
  const adminRepository = new PrismaAdminRepository();
  return new ManageComplianceUseCase(adminRepository);
}
