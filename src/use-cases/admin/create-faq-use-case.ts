import { FaqRepository } from '@/repositories/faq-repository';
import { FAQ } from '@prisma/client';

interface CreateFaqInput {
  question: string;
  answer: string;
  categoryId: number; 
}

export class CreateFaqUseCase {
  constructor(private readonly faqRepository: FaqRepository) {}

  async execute(input: CreateFaqInput): Promise<FAQ> {
    const { question, answer, categoryId } = input; 
    return this.faqRepository.create(question, answer, categoryId); 
  }
}
