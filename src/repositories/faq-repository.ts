import { FAQ, FaqCategory } from '@prisma/client';

export interface FaqRepository {
  create(question: string, answer: string, categoryId: number): Promise<FAQ>;
  update(id: number, question?: string, answer?: string, categoryId?: number): Promise<FAQ>;
  findAll(categoryId?: number): Promise<FAQ[]>;
  findById(id: number): Promise<FAQ | null>;
  delete(id: number): Promise<FAQ>;
  createCategory(name: string): Promise<FaqCategory>;
  listCategories(): Promise<FaqCategory[]>; 
}
