// src/use-cases/admin/delete-faq-use-case.ts

import { FaqRepository } from '@/repositories/faq-repository';

export class DeleteFaqUseCase {
  constructor(private readonly faqRepository: FaqRepository) {}

  async execute(faqId: number): Promise<void> {
    return this.faqRepository.delete(faqId);
  }
}
