// src/repositories/prisma/prisma-faq-repository.ts

import { FaqRepository } from '@/repositories/faq-repository';
import { FAQ, FaqCategory } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaFaqRepository implements FaqRepository {
  async create(question: string, answer: string, categoryId: number): Promise<FAQ> {
    return prisma.fAQ.create({
      data: {
        question,
        answer,
        categoryId,
      },
    });
  }

  async createCategory(name: string): Promise<FaqCategory> {
    return prisma.faqCategory.create({
      data: {
        name,
      },
    });
  }

  async update(id: number, question?: string, answer?: string, categoryId?: number): Promise<FAQ> {
    return prisma.fAQ.update({
      where: { id },
      data: {
        question: question || undefined,
        answer: answer || undefined,
        categoryId: categoryId || undefined,
      },
    });
  }

  async findAll(categoryId?: number): Promise<FAQ[]> {
    return prisma.fAQ.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: true,
      },
    });
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await prisma.faqCategory.delete({
      where: { id: categoryId },
    });
  }

  async listCategories(): Promise<(FaqCategory & { faqs: { id: number; question: string; answer: string }[] })[]> {
    return prisma.faqCategory.findMany({
      include: {
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<FAQ | null> {
    return prisma.fAQ.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.fAQ.delete({
      where: { id },
    });
  }
}
