import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { DeleteEnterpriseImagesUseCase } from '@/use-cases/admin/delete-images-enterprise-use-case';

export function makeDeleteEnterpriseImagesUseCase(): DeleteEnterpriseImagesUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository();
  return new DeleteEnterpriseImagesUseCase(enterpriseRepository);
}
