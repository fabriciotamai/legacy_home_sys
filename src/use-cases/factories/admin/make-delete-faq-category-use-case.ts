// src/factories/faq/make-delete-faq-category.ts

import { PrismaFaqRepository } from '@/repositories/prisma/prisma-faq-repository';
import { DeleteFaqCategoryUseCase } from '@/use-cases/admin/delete-faq-category-use-case';

export function makeDeleteFaqCategory(): DeleteFaqCategoryUseCase {
  const faqRepository = new PrismaFaqRepository(); 
  return new DeleteFaqCategoryUseCase(faqRepository);
}
