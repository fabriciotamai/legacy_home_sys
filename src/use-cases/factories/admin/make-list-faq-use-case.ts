// src/factories/faq/make-list-faqs.ts

import { PrismaFaqRepository } from '@/repositories/prisma/prisma-faq-repository';
import { ListFaqsUseCase } from '@/use-cases/admin/list-faq-use-case';

export function makeListFaqs(): ListFaqsUseCase {
  const faqRepository = new PrismaFaqRepository();
  return new ListFaqsUseCase(faqRepository);
}
