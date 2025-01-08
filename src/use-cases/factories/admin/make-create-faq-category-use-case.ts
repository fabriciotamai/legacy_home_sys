// src/factories/faq/make-create-faq-category.ts

import { PrismaFaqRepository } from '@/repositories/prisma/prisma-faq-repository';
import { CreateFaqCategoryUseCase } from '@/use-cases/admin/create-faq-category-use-case';

export function makeCreateFaqCategory(): CreateFaqCategoryUseCase {
  const faqRepository = new PrismaFaqRepository(); 
  return new CreateFaqCategoryUseCase(faqRepository);
}
