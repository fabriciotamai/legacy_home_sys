// src/repositories/faq-repository.ts

import { FAQ, FaqCategory } from '@prisma/client';

export interface FaqRepository {
  create(question: string, answer: string, categoryId: number): Promise<FAQ>;
  update(id: number, question?: string, answer?: string, categoryId?: number): Promise<FAQ>;
  findAll(categoryId?: number): Promise<FAQ[]>;
  findById(id: number): Promise<FAQ | null>;
  delete(id: number): Promise<void>;
  createCategory(name: string): Promise<FaqCategory>;
  listCategories(): Promise<FaqCategory[]>; 
  deleteCategory(categoryId: number): Promise<void>;
}
