// src/factories/faq/make-list-faq-categories.ts

import { PrismaFaqRepository } from '@/repositories/prisma/prisma-faq-repository';
import { ListFaqCategoriesUseCase } from '@/use-cases/admin/list-faq-categories-use-case';

export function makeListFaqCategories(): ListFaqCategoriesUseCase {
  const faqRepository = new PrismaFaqRepository();  
  return new ListFaqCategoriesUseCase(faqRepository);
}
