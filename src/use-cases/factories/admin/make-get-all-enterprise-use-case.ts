import { PrismaEnterpriseRepository } from '@/repositories/prisma/prisma-enterprise-repository';
import { GetAllEnterprisesUseCase } from '@/use-cases/admin/get-all-enterprise-use-case'; // Corrigido o caminho do use case

export function makeGetAllEnterprisesUseCase(): GetAllEnterprisesUseCase {
  const enterpriseRepository = new PrismaEnterpriseRepository(); // Certifique-se que está importando o repositório correto
  return new GetAllEnterprisesUseCase(enterpriseRepository); // Passa o repositório para o use case
}
