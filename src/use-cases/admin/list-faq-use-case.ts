// src/use-cases/faq/list-faqs-usecase.ts

import { FaqRepository } from '@/repositories/faq-repository';
import { FAQ } from '@prisma/client';

export class ListFaqsUseCase {
  constructor(private readonly faqRepository: FaqRepository) {}

  async execute(categoryId?: number): Promise<FAQ[]> {
    return this.faqRepository.findAll(categoryId);
  }
}
