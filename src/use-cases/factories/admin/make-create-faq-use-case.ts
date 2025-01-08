import { PrismaFaqRepository } from '@/repositories/prisma/prisma-faq-repository';
import { CreateFaqUseCase } from '@/use-cases/admin/create-faq-use-case';

export function makeCreateFaq(): CreateFaqUseCase {
  const faqRepository = new PrismaFaqRepository();
  return new CreateFaqUseCase(faqRepository);
}
