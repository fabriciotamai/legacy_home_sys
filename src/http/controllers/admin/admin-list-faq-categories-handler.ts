import { makeListFaqCategories } from '@/use-cases/factories/admin/make-list-faq-categories-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function adminListFaqCategoriesHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
  
    const listFaqCategoriesUseCase = makeListFaqCategories();
    const categories = await listFaqCategoriesUseCase.execute();

   
    reply.status(200).send({
      message: 'Categorias listadas com sucesso',
      categories
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    reply.status(500).send({
      error: 'Erro interno ao buscar categorias.'
    });
  }
}
