// src/use-cases/faq/list-faq-categories-usecase.ts

import { FaqRepository } from '@/repositories/faq-repository';
import { FaqCategory } from '@prisma/client';

export class ListFaqCategoriesUseCase {
  constructor(private readonly faqRepository: FaqRepository) {}

  async execute(): Promise<FaqCategory[]> {
    return this.faqRepository.listCategories();
  }
}
