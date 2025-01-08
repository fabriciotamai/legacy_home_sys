// src/use-cases/faq/delete-faq-category-usecase.ts

import { FaqRepository } from '@/repositories/faq-repository';

export class DeleteFaqCategoryUseCase {
  constructor(private readonly faqRepository: FaqRepository) {}

  async execute(categoryId: number): Promise<void> {
    return this.faqRepository.deleteCategory(categoryId);
  }
}
