// src/use-cases/factories/admin/make-delete-faq-use-case.ts

import { PrismaFaqRepository } from '@/repositories/prisma/prisma-faq-repository';
import { DeleteFaqUseCase } from '@/use-cases/admin/delete-faq-use-case';

export function makeDeleteFaq(): DeleteFaqUseCase {
  const faqRepository = new PrismaFaqRepository();
  return new DeleteFaqUseCase(faqRepository);
}
