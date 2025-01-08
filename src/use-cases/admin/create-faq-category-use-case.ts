
import { FaqRepository } from '@/repositories/faq-repository';
import { FaqCategory } from '@prisma/client';

interface CreateFaqCategoryInput {
  name: string;
}

export class CreateFaqCategoryUseCase {
  constructor(private readonly faqRepository: FaqRepository) {}

  async execute(input: CreateFaqCategoryInput): Promise<FaqCategory> {
    const { name } = input;
    return this.faqRepository.createCategory(name);
  }
}
